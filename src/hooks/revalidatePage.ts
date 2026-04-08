/**
 * Revalidation hooks for the Pages collection.
 * Clears Next.js page cache when pages are published, unpublished, or deleted
 * so content changes via Puck editor appear immediately on the live site.
 * Same pattern as src/collections/Posts/hooks/revalidatePost.ts.
 * Registered in payload.config.ts via collection stub that createPuckPlugin merges into.
 */
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Page } from '../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/${doc.slug}`
      payload.logger.info(`Revalidating page at path: ${path}`)
      revalidatePath(path)
    }

    // If slug changed, also revalidate the old path
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldPath = `/${previousDoc.slug}`
      payload.logger.info(`Revalidating old page at path: ${oldPath}`)
      revalidatePath(oldPath)
    }

    // If the page was unpublished, revalidate to clear it
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
    const path = `/${doc?.slug}`
    revalidatePath(path)
  }
  return doc
}
