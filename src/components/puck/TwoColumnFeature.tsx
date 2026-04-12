/**
 * TwoColumnFeature — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { createColorField, createOptionalColorField } from './fields'
import { TwoColumnFeatureRender, defaultProps } from './TwoColumnFeature.render'
import type { TwoColumnFeatureProps } from './TwoColumnFeature.render'

export type { TwoColumnFeatureProps } from './TwoColumnFeature.render'
export { TwoColumnFeatureRender, defaultProps } from './TwoColumnFeature.render'

export const TwoColumnFeatureConfig: ComponentConfig<TwoColumnFeatureProps> = {
  label: 'Two Column Feature',
  fields: {
    heading: { type: 'text', label: 'Heading' },
    body: { type: 'richtext', label: 'Body Text' },
    ctaText: { type: 'text', label: 'CTA Button Text (leave empty to hide)' },
    ctaLink: { type: 'text', label: 'CTA Button Link' },
    ctaVariant: {
      type: 'radio',
      label: 'CTA Style',
      options: [
        { label: 'Filled', value: 'filled' },
        { label: 'Outline', value: 'outline' },
      ],
    },
    secondaryCtaText: { type: 'text', label: 'Secondary CTA Text (leave empty to hide)' },
    secondaryCtaLink: { type: 'text', label: 'Secondary CTA Link' },
    featureImage: createMediaField({ label: 'Feature Image' }),
    imageStyle: {
      type: 'radio',
      label: 'Image Style',
      options: [
        { label: 'Plain', value: 'plain' },
        { label: 'Card (border + shadow)', value: 'card' },
      ],
    },
    layout: {
      type: 'radio',
      label: 'Layout',
      options: [
        { label: 'Image Right', value: 'image-right' },
        { label: 'Image Left', value: 'image-left' },
      ],
    },
    bgColor: createOptionalColorField({ label: 'Section Background Color' }),
    headingColor: {
      type: 'radio',
      label: 'Heading Color',
      options: [
        { label: 'Primary (brand)', value: 'primary' },
        { label: 'Dark (#222)', value: 'dark' },
      ],
    },
    primaryColor: createColorField({ label: 'Brand Color' }),
  },
  defaultProps,
  render: TwoColumnFeatureRender,
}
