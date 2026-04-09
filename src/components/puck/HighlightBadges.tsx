/**
 * HighlightBadges — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { HighlightBadgesRender, defaultProps } from './HighlightBadges.render'
import type { HighlightBadgesProps } from './HighlightBadges.render'

export type { HighlightBadgesProps, BadgeItem } from './HighlightBadges.render'
export { HighlightBadgesRender, defaultProps } from './HighlightBadges.render'

export const HighlightBadgesConfig: ComponentConfig<HighlightBadgesProps> = {
  label: 'Highlight Badges',
  fields: {
    heading: { type: 'text', label: 'Heading (e.g. "Step into:")' },
    badges: {
      type: 'array',
      label: 'Badges',
      arrayFields: {
        label: { type: 'text', label: 'Badge Label' },
        icon: createMediaField({ label: 'Badge Icon' }),
      },
      defaultItemProps: { label: 'Topic', icon: null },
    },
    primaryColor: { type: 'text', label: 'Primary Color (hex, for circle stroke + label)' },
  },
  defaultProps,
  render: HighlightBadgesRender,
}
