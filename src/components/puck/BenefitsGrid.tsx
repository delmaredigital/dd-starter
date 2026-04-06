/**
 * BenefitsGrid — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { BenefitsGridRender, defaultProps } from './BenefitsGrid.render'
import type { BenefitsGridProps } from './BenefitsGrid.render'

export type { BenefitsGridProps, BenefitItem } from './BenefitsGrid.render'
export { BenefitsGridRender, defaultProps } from './BenefitsGrid.render'

export const BenefitsGridConfig: ComponentConfig<BenefitsGridProps> = {
  label: 'Benefits Grid',
  fields: {
    sectionHeading: { type: 'text', label: 'Section Heading' },
    benefits: {
      type: 'array',
      label: 'Benefits',
      arrayFields: {
        icon: createMediaField({ label: 'Icon' }),
        heading: { type: 'text', label: 'Heading' },
        description: { type: 'textarea', label: 'Description' },
      },
    },
    ctaText: { type: 'text', label: 'CTA Button Text (leave empty to hide)' },
    ctaLink: { type: 'text', label: 'CTA Button Link' },
    primaryColor: { type: 'text', label: 'Brand Color (hex)' },
    accentBarImage: createMediaField({ label: 'Accent Bar Image (optional — falls back to colored bar)' }),
  },
  defaultProps,
  render: BenefitsGridRender,
}
