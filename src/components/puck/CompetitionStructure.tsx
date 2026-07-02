/**
 * CompetitionStructure — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { CompetitionStructureRender, defaultProps } from './CompetitionStructure.render'
import type { CompetitionStructureProps } from './CompetitionStructure.render'

export type {
  CompetitionStructureProps,
  InfoCard,
  InfoCardItem,
  RoundDetail,
  RoundItem,
} from './CompetitionStructure.render'
export { CompetitionStructureRender, defaultProps } from './CompetitionStructure.render'

export const CompetitionStructureConfig: ComponentConfig<CompetitionStructureProps> = {
  label: 'Competition Structure',
  fields: {
    heading: {
      type: 'text',
      label: 'Heading (empty = default)',
      placeholder: defaultProps.heading,
    },
    heroImage: createMediaField({ label: 'Hero Image' }),
    heroOverlayOpacity: {
      type: 'number',
      label: 'Hero Overlay Opacity (0–1)',
      min: 0,
      max: 1,
      step: 0.05,
    },
    infoCards: {
      type: 'array',
      label: 'Info Cards',
      arrayFields: {
        icon: createMediaField({ label: 'Icon' }),
        heading: { type: 'text', label: 'Card Heading' },
        body: { type: 'textarea', label: 'Plain Text (leave empty if using items)' },
        calloutHeading: { type: 'text', label: 'Callout Heading (optional)' },
        calloutBody: { type: 'textarea', label: 'Callout Body (optional)' },
        calloutEmail: { type: 'text', label: 'Callout Email (optional)' },
        items: {
          type: 'array',
          label: 'Structured Items (optional)',
          arrayFields: {
            name: { type: 'text', label: 'Name' },
            grades: { type: 'text', label: 'Subtitle' },
          },
        },
      },
    },
    roundsHeading: {
      type: 'text',
      label: 'Rounds Heading (empty to hide)',
    },
    rounds: {
      type: 'array',
      label: 'Rounds',
      arrayFields: {
        title: { type: 'text', label: 'Round Title' },
        items: {
          type: 'array',
          label: 'Detail Items',
          arrayFields: {
            label: { type: 'text', label: 'Bold Prefix (optional)' },
            text: { type: 'textarea', label: 'Description' },
          },
        },
      },
    },
    ctaText: { type: 'text', label: 'Primary CTA Text (empty to hide)' },
    ctaLink: { type: 'text', label: 'Primary CTA Link' },
    secondaryCtaText: { type: 'text', label: 'Secondary CTA Text (empty to hide)' },
    secondaryCtaLink: { type: 'text', label: 'Secondary CTA Link' },
  },
  defaultProps,
  render: CompetitionStructureRender,
}
