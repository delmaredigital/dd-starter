import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { HybridPageData } from '@delmaredigital/payload-puck/render'
import { puckServerConfig } from '@/puck/config.server'
import { puckRenderLayouts } from '@/lib/puck/render-layouts'
import { RscHybridPageRenderer } from '@/lib/puck/RscHybridPageRenderer'
import type { PuckData } from '@/puck/types'


export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug: slug?.split('/') ?? [] }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string[]
  }>
  searchParams: Promise<{
    schoolDashboard?: string
  }>
}

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug: slugSegments } = await paramsPromise
  const searchParams = await searchParamsPromise
  // Join segments to support nested paths (e.g. /mit-ewb/engineering-competition)
  const slug = slugSegments ? slugSegments.map(decodeURIComponent).join('/') : 'home'
  const url = '/' + slug
  const page = await queryPageBySlug({
    slug,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  return (
    <article>
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RscHybridPageRenderer
        page={withSchoolDashboardPreview(
          page as unknown as HybridPageData,
          searchParams.schoolDashboard === '1',
        )}
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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug: slugSegments } = await paramsPromise
  const slug = slugSegments ? slugSegments.map(decodeURIComponent).join('/') : 'home'
  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
}

function withSchoolDashboardPreview(page: HybridPageData, enabled: boolean): HybridPageData {
  const puckData = page.puckData as PuckData | null | undefined
  if (!enabled || !puckData?.content) return page

  return {
    ...page,
    puckData: {
      ...puckData,
      content: puckData.content.map((item) =>
        item.type === 'CompetitionHero'
          ? { ...item, props: { ...item.props, showSchoolDashboardPanel: true } }
          : item,
      ),
    },
  }
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
