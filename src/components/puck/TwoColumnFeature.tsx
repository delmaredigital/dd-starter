/**
 * TwoColumnFeature — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { TwoColumnFeatureRender, defaultProps } from './TwoColumnFeature.render'
import type { TwoColumnFeatureProps } from './TwoColumnFeature.render'

export type { TwoColumnFeatureProps } from './TwoColumnFeature.render'
export { TwoColumnFeatureRender, defaultProps } from './TwoColumnFeature.render'

export const TwoColumnFeatureConfig: ComponentConfig<TwoColumnFeatureProps> = {
  label: 'Two Column Feature',
  fields: {
    heading: { type: 'text', label: 'Heading' },
    body: { type: 'textarea', label: 'Body Text' },
    ctaText: { type: 'text', label: 'CTA Button Text (leave empty to hide)' },
    ctaLink: { type: 'text', label: 'CTA Button Link' },
    featureImage: createMediaField({ label: 'Feature Image' }),
    layout: {
      type: 'radio',
      label: 'Layout',
      options: [
        { label: 'Image Right', value: 'image-right' },
        { label: 'Image Left', value: 'image-left' },
      ],
    },
    primaryColor: { type: 'text', label: 'Brand Color (hex)' },
  },
  defaultProps,
  render: TwoColumnFeatureRender,
}
