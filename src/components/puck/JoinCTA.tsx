/**
 * JoinCTA — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { createBrandPickerField } from './fields'
import { JoinCTARender, defaultProps } from './JoinCTA.render'
import type { JoinCTAProps } from './JoinCTA.render'

export type { JoinCTAProps } from './JoinCTA.render'
export { JoinCTARender, defaultProps } from './JoinCTA.render'

export const JoinCTAConfig: ComponentConfig<JoinCTAProps> = {
  label: 'Join CTA',
  fields: {
    heading: { type: 'text', label: 'Heading (empty = default)', placeholder: defaultProps.heading },
    body: { type: 'textarea', label: 'Body Text (empty = default)', placeholder: defaultProps.body },
    photo: createMediaField({ label: 'Circular Photo (inside globe frame)' }),
    ctaText: { type: 'text', label: 'Primary CTA Text (empty to hide)' },
    ctaLink: { type: 'text', label: 'Primary CTA Link' },
    secondaryCtaText: { type: 'text', label: 'Secondary CTA Text (empty to hide)' },
    secondaryCtaLink: { type: 'text', label: 'Secondary CTA Link' },
    circleSource: createBrandPickerField({ label: 'Globe Circle Color' }),
  },
  defaultProps,
  render: JoinCTARender,
}
