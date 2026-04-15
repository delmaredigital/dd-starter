/**
 * FosteringSection — editor config. Wraps TwoColumnFeature with locked settings.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { FosteringSectionRender, defaultProps } from './FosteringSection.render'
import type { FosteringSectionProps } from './FosteringSection.render'

export type { FosteringSectionProps } from './FosteringSection.render'
export { FosteringSectionRender, defaultProps } from './FosteringSection.render'

export const FosteringSectionConfig: ComponentConfig<FosteringSectionProps> = {
  label: 'Fostering Section',
  fields: {
    heading: { type: 'text', label: 'Heading' },
    body: { type: 'richtext', label: 'Body Text' },
    featureImage: createMediaField({ label: 'Feature Image' }),
    ctaText: { type: 'text', label: 'Primary CTA Text (empty to hide)' },
    ctaLink: { type: 'text', label: 'Primary CTA Link' },
    secondaryCtaText: { type: 'text', label: 'Secondary CTA Text (empty to hide)' },
    secondaryCtaLink: { type: 'text', label: 'Secondary CTA Link' },
  },
  defaultProps,
  render: FosteringSectionRender,
}
