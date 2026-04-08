import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import Link from 'next/link'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './[...slug]/page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { HybridPageRenderer, type HybridPageData } from '@delmaredigital/payload-puck/render'
import { puckServerConfig } from '@/puck/config.server'
import { puckRenderLayouts } from '@/lib/puck/render-layouts'

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()

  const page = await queryHomepage()

  // Fallback for new installations with no homepage
  if (!page) {
    return <WelcomeFallback />
  }

  const url = '/'

  return (
    <article>
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <HybridPageRenderer
        page={page as unknown as HybridPageData}
        config={puckServerConfig}
        layouts={puckRenderLayouts}
        legacyRenderer={() => (
          <div className="container py-16">
            <p>This page uses a legacy format. Please edit it in the Puck editor to update.</p>
          </div>
        )}
      />
    </article>
  )
}

function WelcomeFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to DD Starter
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Your Payload CMS site is ready. Create your first admin user and start building.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Go to Admin Panel
        </Link>
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
          Create a page and mark it as your homepage to replace this message.
        </p>
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryHomepage()

  if (!page) {
    return {
      title: 'Welcome | DD Starter',
      description: 'Get started with your new Payload CMS site',
    }
  }

  return generateMeta({ doc: page })
}

const queryHomepage = cache(async () => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  // First try to find a page marked as homepage
  const homepageResult = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      isHomepage: {
        equals: true,
      },
    },
  })

  if (homepageResult.docs?.[0]) {
    return homepageResult.docs[0] as RequiredDataFromCollectionSlug<'pages'>
  }

  // Fallback: look for a page with slug 'home'
  const homeSlugResult = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: 'home',
      },
    },
  })

  return (homeSlugResult.docs?.[0] as RequiredDataFromCollectionSlug<'pages'>) || null
})
