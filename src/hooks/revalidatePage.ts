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
 *
 * Debounce: folder renames in payload-puck's page-tree trigger slug cascade
 * updates on every page in the folder. Each fires this hook, causing a burst
 * of revalidatePath calls that can OOM the server. We collect paths for 10s
 * and flush them sequentially after a 10s quiet period.
 */
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Page } from '../payload-types'

const DEBOUNCE_MS = 10_000

let pendingPaths: Set<string> | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let savedLogger: { info: (msg: string) => void } | undefined

function enqueueRevalidation(path: string, logger?: { info: (msg: string) => void }) {
  if (logger) savedLogger = logger

  if (!pendingPaths) {
    pendingPaths = new Set()
  }
  pendingPaths.add(path)

  // Reset timer on each call — flush only after quiet period
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const paths = pendingPaths!
    pendingPaths = null
    debounceTimer = null

    for (const p of paths) {
      try {
        savedLogger?.info(`Revalidating page at path: ${p}`)
        revalidatePath(p)
      } catch (e) {
        savedLogger?.info(`Revalidation failed for ${p}: ${e}`)
      }
    }
  }, DEBOUNCE_MS)
}

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  req: { payload },
}) => {
  // TEMP: disabled to isolate folder rename crash
  payload.logger.info(`[revalidatePage] skipped for ${doc.slug} (disabled for debugging)`)
  return doc
}

export const revalidateDeletePage: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    enqueueRevalidation(`/${doc?.slug}`)
  }
  return doc
}
