/**
 * CompetitionStructure — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { createBrandPickerField } from './fields'
import { CompetitionStructureRender, defaultProps } from './CompetitionStructure.render'
import type { CompetitionStructureProps } from './CompetitionStructure.render'

export type { CompetitionStructureProps, InfoCard, InfoCardItem } from './CompetitionStructure.render'
export { CompetitionStructureRender, defaultProps } from './CompetitionStructure.render'

export const CompetitionStructureConfig: ComponentConfig<CompetitionStructureProps> = {
  label: 'Competition Structure',
  fields: {
    heading: { type: 'text', label: 'Heading (empty = default)', placeholder: defaultProps.heading },
    heroImage: createMediaField({ label: 'Hero Image' }),
    heroOverlaySource: createBrandPickerField({ label: 'Hero Overlay Color' }),
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
    ctaText: { type: 'text', label: 'Primary CTA Text (empty to hide)' },
    ctaLink: { type: 'text', label: 'Primary CTA Link' },
    secondaryCtaText: { type: 'text', label: 'Secondary CTA Text (empty to hide)' },
    secondaryCtaLink: { type: 'text', label: 'Secondary CTA Link' },
  },
  defaultProps,
  render: CompetitionStructureRender,
}
