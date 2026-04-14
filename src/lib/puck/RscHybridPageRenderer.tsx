/**
 * Copy of @delmaredigital/payload-puck's HybridPageRenderer that uses
 * RscPageRenderer instead of PageRenderer.
 *
 * Source: ~/dev/payload-puck/src/render/HybridPageRenderer.tsx
 * ⚠️ KEEP IN SYNC — check on every payload-puck version bump.
 */
import type { Data as PuckData } from '@puckeditor/core'
import { RscPageRenderer } from './RscPageRenderer'
import type { PageRendererProps } from './RscPageRenderer'
import type { ReactNode } from 'react'

export interface HybridPageData {
  editorVersion?: 'legacy' | 'puck'
  puckData?: PuckData | null
  [key: string]: unknown
}

interface HybridPageRendererProps extends Omit<PageRendererProps, 'data'> {
  page: HybridPageData
  legacyRenderer?: (blocks: unknown[]) => ReactNode
  legacyBlocksField?: string
  fallback?: ReactNode
}

export function RscHybridPageRenderer({
  page,
  legacyRenderer,
  legacyBlocksField = 'layout',
  fallback = <div>No content available</div>,
  config,
  layouts,
  wrapper,
  className,
}: HybridPageRendererProps) {
  const puckData = page.puckData as PuckData | null | undefined
  const hasPuckContent =
    puckData?.content && Array.isArray(puckData.content) && puckData.content.length > 0

  const legacyBlocks = page[legacyBlocksField] as unknown[] | undefined
  const hasLegacyContent = Array.isArray(legacyBlocks) && legacyBlocks.length > 0

  if (page.editorVersion === 'puck' && hasPuckContent) {
    return (
      <RscPageRenderer
        data={puckData as PuckData}
        config={config}
        layouts={layouts}
        wrapper={wrapper}
        className={className}
      />
    )
  }

  if (hasLegacyContent && legacyRenderer) {
    return <>{legacyRenderer(legacyBlocks as unknown[])}</>
  }

  return <>{fallback}</>
}
