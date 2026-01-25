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
        afterLoginPath: '/admin/page-tree', // Redirect to page tree after login
      },
    },
  }),
  // Page Tree - hierarchical URL management
  pageTreePlugin({
    collections: ['pages', 'posts'],
    folderSlug: 'payload-folders',
    segmentFieldName: 'pathSegment',
    pageSegmentFieldName: 'pageSegment',
  }),
  // Puck - visual page editor
  createPuckPlugin({
    pagesCollection: 'pages',
    layouts: puckLayoutOptions,
    editorStylesheet: 'src/app/(frontend)/globals.css',
    editorStylesheetCompiled: '/puck-editor-styles.css', // Pre-compiled by withPuckCSS at build time
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
]
