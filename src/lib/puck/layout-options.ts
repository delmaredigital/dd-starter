/**
 * Page Layout Options for Payload CMS
 *
 * These are serializable layout options for createPuckPlugin() and field definitions.
 * Keep in sync with layouts.tsx (which has React components for rendering).
 */

import type { LayoutDefinition } from '@delmaredigital/payload-puck/layouts'

export const puckLayoutOptions: LayoutDefinition[] = [
  { value: 'default', label: 'Default' },
  { value: 'full-width', label: 'Full Width' },
  { value: 'landing', label: 'Landing' },
]

export type PageLayoutValue = 'default' | 'full-width' | 'landing'
