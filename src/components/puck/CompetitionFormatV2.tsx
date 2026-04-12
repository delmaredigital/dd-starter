/**
 * CompetitionFormatV2 — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createColorField } from './fields'
import { CompetitionFormatV2Render, defaultProps } from './CompetitionFormatV2.render'
import type { CompetitionFormatV2Props } from './CompetitionFormatV2.render'

export type { CompetitionFormatV2Props, FormatRound, DetailCard } from './CompetitionFormatV2.render'
export { CompetitionFormatV2Render, defaultProps } from './CompetitionFormatV2.render'

export const CompetitionFormatV2Config: ComponentConfig<CompetitionFormatV2Props> = {
  label: 'Competition Format V2',
  fields: {
    heading: { type: 'text', label: 'Heading' },
    rounds: {
      type: 'array',
      label: 'Rounds',
      arrayFields: {
        title: { type: 'text', label: 'Round Title' },
        description: { type: 'textarea', label: 'Description' },
        dateLabel: { type: 'text', label: 'Date / Deadline' },
        infoCards: {
          type: 'array',
          label: 'Info Cards (Time, Duration, etc.)',
          arrayFields: {
            heading: { type: 'text', label: 'Card Heading' },
            body: { type: 'richtext', label: 'Card Body' },
          },
        },
        formatDetails: { type: 'richtext', label: 'Format Details (triggers "Format :" header)' },
        formatCards: {
          type: 'array',
          label: 'Format Cards (also triggers "Format :" header)',
          arrayFields: {
            heading: { type: 'text', label: 'Card Heading' },
            body: { type: 'textarea', label: 'Card Body' },
          },
        },
        body: { type: 'richtext', label: 'Body (paragraphs, bullets, etc.)' },
      },
    },
    ctaText: { type: 'text', label: 'Primary CTA Text (empty to hide)' },
    ctaLink: { type: 'text', label: 'Primary CTA Link' },
    secondaryCtaText: { type: 'text', label: 'Secondary CTA Text (empty to hide)' },
    secondaryCtaLink: { type: 'text', label: 'Secondary CTA Link' },
    primaryColor: createColorField({ label: 'Brand Color' }),
    cardBgColor: createColorField({ label: 'Card Background Color' }),
  },
  defaultProps,
  render: CompetitionFormatV2Render,
}
