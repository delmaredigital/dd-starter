import { s3Storage } from '@payloadcms/storage-s3'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { pageTreePlugin } from '@delmaredigital/payload-page-tree'
import { createPuckPlugin } from '@delmaredigital/payload-puck/plugin'
import { puckLayoutOptions } from '@/lib/puck/layout-options'
import {
  betterAuthCollections,
  createBetterAuthPlugin,
  payloadAdapter,
} from '@delmaredigital/payload-better-auth'
import { betterAuthOptions } from '@/lib/auth/config'
import { betterAuth } from 'better-auth'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | DD Starter` : 'DD Starter'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  // Better Auth - collections must come before createBetterAuthPlugin
  betterAuthCollections({
    betterAuthOptions,
    skipCollections: ['user'], // We define Users ourselves
  }),
  // Initialize Better Auth with auto-injected endpoints and admin components
  createBetterAuthPlugin({
    createAuth: (payload) =>
      betterAuth({
        ...betterAuthOptions,
        database: payloadAdapter({
          payloadClient: payload,
          adapterConfig: {
            enableDebugLogs: false,
          },
        }),
        // For Payload's default SERIAL IDs:
        advanced: {
          database: {
            generateId: 'serial',
          },
        },
        secret: process.env.BETTER_AUTH_SECRET,
        trustedOrigins: [
          'http://localhost:3000',
          'https://localhost:3000',
          process.env.NEXT_PUBLIC_APP_URL,
        ].filter(Boolean) as string[],
      }),
    admin: {
      betterAuthOptions, // Required for management UI auto-detection
      login: {
        enablePasskey: true, // Enable passkey sign-in option
        afterLoginPath: '/p-kcCapdQH/page-tree', // Redirect to page tree after login
      },
      apiKey: {
        requiredRole: 'admin',
      },
    },
  }),
  // Puck - visual page editor (must run BEFORE page-tree so Pages collection exists)
  createPuckPlugin({
    pagesCollection: 'pages',
    layouts: puckLayoutOptions,
    editorStylesheet: 'src/app/(frontend)/globals.css',
    editorStylesheetCompiled: '/puck-editor-styles.css', // Pre-compiled by withPuckCSS at build time
  }),
  // Page Tree - hierarchical URL management (runs after Puck creates Pages)
  pageTreePlugin({
    collections: ['pages', 'posts'],
    folderSlug: 'payload-folders',
    segmentFieldName: 'pathSegment',
    pageSegmentFieldName: 'pageSegment',
  }),
  // Redirects
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  // SEO
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  // Search
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  // Cloudflare R2 storage via S3-compatible API.
  // Bucket: "public", custom domain: cdn.algoed.co, prefix: pages/
  // Files served directly from R2 (bypasses Next.js Router Vary headers,
  // enables Cloudflare Polish). Previously used Railway Object Storage (Tigris)
  // which was private-only — media went through /api/media/file/* (App Router),
  // injecting Vary headers that broke Polish (cf-polished: vary_header_present).
  //
  // Remaining migration steps:
  //   1. Copy existing files Railway bucket → R2 bucket (aws s3 sync or boto3)
  //   2. One-time DB migration: rewrite media.url fields AND puckData
  //      MediaReference URLs from /api/media/file/X → https://cdn.algoed.co/pages/X
  //   3. Verify uploads go to R2 + Polish activates
  //   4. Cleanup: remove AWS_* env vars, delete Railway bucket
  s3Storage({
    enabled: Boolean(process.env.R2_BUCKET),
    alwaysInsertFields: true,
    collections: {
      media: {
        prefix: 'pages',
        disablePayloadAccessControl: true,
        generateFileURL: ({ filename, prefix }) => {
          const key = prefix ? `${prefix}/${filename}` : filename
          return `${process.env.R2_PUBLIC_URL}/${key}`
        },
      },
    },
    bucket: process.env.R2_BUCKET || '',
    config: {
      endpoint: process.env.R2_ENDPOINT,
      region: 'auto',
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    },
  }),
]
