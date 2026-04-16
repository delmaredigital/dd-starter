/**
 * Copy of @delmaredigital/payload-puck's PageRenderer with one change:
 * imports Render from '@puckeditor/core/rsc' instead of '@puckeditor/core'.
 * This enables 'use client' component hydration on public pages.
 *
 * Source: ~/dev/payload-puck/src/render/PageRenderer.tsx
 * ⚠️ KEEP IN SYNC — when @delmaredigital/payload-puck updates PageRenderer,
 * this file must be updated to match. Check on every payload-puck version bump.
 */
// ⚠️ THE ONLY INTENTIONAL CHANGE from the original PageRenderer:
// '@puckeditor/core/rsc' instead of '@puckeditor/core'
// This is the entire reason this file exists — RSC Render enables
// 'use client' component hydration on public pages.
import { Render } from '@puckeditor/core/rsc'
import type { Config as PuckConfig, Data as PuckData } from '@puckeditor/core'
import { baseConfig } from '@delmaredigital/payload-puck/config'
import { LayoutWrapper, getLayout, DEFAULT_LAYOUTS, type LayoutDefinition } from '@delmaredigital/payload-puck/layouts'

export interface PageRendererProps {
  data: PuckData
  config?: PuckConfig
  wrapper?: React.ComponentType<{ children: React.ReactNode }>
  className?: string
  layouts?: LayoutDefinition[]
}

export function RscPageRenderer({
  data,
  config = baseConfig,
  wrapper: Wrapper,
  className,
  layouts = DEFAULT_LAYOUTS,
}: PageRendererProps) {
  if (!data || !data.content) {
    return (
      <div className={className}>
        <p>No content available</p>
      </div>
    )
  }

  // Merge defaultProps into each component's props — Puck editor does this automatically,
  // but the RSC renderer receives raw puckData without defaults applied.
  // Shallow merge: { ...defaultProps, ...storedProps } — stored values win.
  const mergedData = {
    ...data,
    content: data.content.map((item) => {
      const componentConfig = (config.components as any)?.[item.type]
      if (!componentConfig?.defaultProps) return item
      return {
        ...item,
        props: { ...componentConfig.defaultProps, ...item.props },
      }
    }),
  }

  const content = <Render config={config} data={mergedData as PuckData} />

  const rootProps = data.root?.props as any

  const overrides = {
    showHeader: rootProps?.showHeader,
    showFooter: rootProps?.showFooter,
    background: rootProps?.pageBackground,
    maxWidth: rootProps?.pageMaxWidth,
  } as any

  let result = content

  if (Wrapper) {
    result = <Wrapper>{result}</Wrapper>
  } else {
    const pageLayout = rootProps?.pageLayout
    const layout = pageLayout ? getLayout(layouts, pageLayout) : undefined

    if (layout) {
      result = (
        <LayoutWrapper layout={layout} className={className} overrides={overrides}>
          {result}
        </LayoutWrapper>
      )
    } else if (className || overrides.background) {
      result = (
        <LayoutWrapper className={className} overrides={overrides}>
          {result}
        </LayoutWrapper>
      )
    }
  }

  return result
}
