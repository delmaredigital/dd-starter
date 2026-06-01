/**
 * Revalidation hooks for the Pages collection.
 * Clears Next.js page cache when pages are published, unpublished, or deleted
 * so content changes via Puck editor appear immediately on the live site.
 * Same pattern as src/collections/Posts/hooks/revalidatePost.ts.
 * Registered in src/collections/Pages.ts (composed via getPuckCollectionConfig).
 *
 * Note: path mapping is simple /${slug}. If a CMS-managed homepage is ever added
 * (isHomepage flag or slug 'home' serving at /), this needs a special case to
 * revalidate '/' instead of '/home'. Currently / redirects to algoed.co so no
 * homepage revalidation is needed.
 */
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    revalidateTag('pages-sitemap', 'max')

    if (doc._status === 'published') {
      const path = `/${doc.slug}`
      payload.logger.info(`Revalidating page at path: ${path}`)
      revalidatePath(path)
    }

    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldPath = `/${previousDoc.slug}`
      payload.logger.info(`Revalidating old page at path: ${oldPath}`)
      revalidatePath(oldPath)
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const path = `/${doc.slug}`
      payload.logger.info(`Revalidating unpublished page at path: ${path}`)
      revalidatePath(path)
    }
  }
  return doc
}

export const revalidateDeletePage: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath(`/${doc?.slug}`)
  }
  return doc
}
