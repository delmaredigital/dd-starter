/**
 * Server-side Puck Render Layouts
 *
 * These layouts are used for frontend rendering with HybridPageRenderer.
 * They do NOT include header/footer components since those are provided
 * by the global layout in (frontend)/layout.tsx.
 *
 * Keep layout values in sync with layouts.tsx (editor layouts)
 * and layout-options.ts (serializable options for plugin).
 */

import type { LayoutDefinition } from '@delmaredigital/payload-puck/layouts'

/**
 * Default layout - no header/footer since global layout provides them
 */
export const defaultRenderLayout: LayoutDefinition = {
  value: 'default',
  label: 'Default',
}

/**
 * Full width layout - no header/footer, full width content
 */
export const fullWidthRenderLayout: LayoutDefinition = {
  value: 'full-width',
  label: 'Full Width',
  fullWidth: true,
}

/**
 * Landing layout - no chrome, ideal for marketing pages
 */
export const landingRenderLayout: LayoutDefinition = {
  value: 'landing',
  label: 'Landing',
  fullWidth: true,
}

/**
 * All render layouts for HybridPageRenderer
 * These should be used on the frontend where global layout provides header/footer
 */
export const puckRenderLayouts: LayoutDefinition[] = [
  defaultRenderLayout,
  fullWidthRenderLayout,
  landingRenderLayout,
]
