/**
 * CompetitionFormat — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { CompetitionFormatRender, defaultProps } from './CompetitionFormat.render'
import type { CompetitionFormatProps } from './CompetitionFormat.render'

export type { CompetitionFormatProps, RoundDetail, FormatBullet } from './CompetitionFormat.render'
export { CompetitionFormatRender, defaultProps } from './CompetitionFormat.render'

export const CompetitionFormatConfig: ComponentConfig<CompetitionFormatProps> = {
  label: 'Competition Format',
  fields: {
    heading: { type: 'text', label: 'Heading' },
    formatImage: createMediaField({ label: 'Format Image (left column)' }),
    rounds: {
      type: 'array',
      label: 'Rounds',
      arrayFields: {
        title: { type: 'text', label: 'Round Title' },
        description: { type: 'textarea', label: 'Description' },
        date: { type: 'text', label: 'Date' },
        formatText: { type: 'text', label: 'Format Text (plain text, used when no bullets)' },
        formatBullets: {
          type: 'array',
          label: 'Format Bullets',
          arrayFields: {
            text: { type: 'text', label: 'Bullet Text' },
          },
        },
        timeAllowed: { type: 'text', label: 'Time Allowed (e.g. "1 hour")' },
        times: { type: 'textarea', label: 'Times (one per line)' },
      },
    },
    ctaText: { type: 'text', label: 'CTA Button Text (leave empty to hide)' },
    ctaLink: { type: 'text', label: 'CTA Button Link' },
  },
  defaultProps,
  render: CompetitionFormatRender,
}
