/**
 * Puck Layout Definitions
 *
 * These layouts define how pages are structured, including header/footer
 * and editor preview styling.
 */
'use client'

import type { LayoutDefinition } from '@delmaredigital/payload-puck/layouts'
import { HeaderClient } from '@/Header/Component.client'
import { FooterClient } from '@/Footer/Component.client'

/**
 * Default layout with site header and footer
 */
export const defaultLayout: LayoutDefinition = {
  value: 'default',
  label: 'Default',
  description: 'Standard page with header and footer',
  header: HeaderClient,
  footer: FooterClient,
  stickyHeaderHeight: 72,
  editorBackground: 'var(--background)',
}

/**
 * Full width layout with header and footer
 */
export const fullWidthLayout: LayoutDefinition = {
  value: 'full-width',
  label: 'Full Width',
  description: 'Full width page with header and footer, no container constraints',
  fullWidth: true,
  header: HeaderClient,
  footer: FooterClient,
  stickyHeaderHeight: 72,
  editorBackground: 'var(--background)',
}

/**
 * Landing layout - no header/footer for custom hero sections
 */
export const landingLayout: LayoutDefinition = {
  value: 'landing',
  label: 'Landing',
  description: 'Landing page without header/footer chrome - ideal for marketing pages',
  fullWidth: true,
  editorBackground: 'var(--background)',
}

/**
 * All available layouts for the Puck editor
 */
export const puckLayouts: LayoutDefinition[] = [
  defaultLayout,
  fullWidthLayout,
  landingLayout,
]
