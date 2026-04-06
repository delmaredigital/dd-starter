/**
 * JoinCTA — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { JoinCTARender, defaultProps } from './JoinCTA.render'
import type { JoinCTAProps } from './JoinCTA.render'

export type { JoinCTAProps } from './JoinCTA.render'
export { JoinCTARender, defaultProps } from './JoinCTA.render'

export const JoinCTAConfig: ComponentConfig<JoinCTAProps> = {
  label: 'Join CTA',
  fields: {
    heading: { type: 'text', label: 'Heading' },
    body: { type: 'textarea', label: 'Body Text' },
    ctaText: { type: 'text', label: 'CTA Button Text (leave empty to hide)' },
    ctaLink: { type: 'text', label: 'CTA Button Link' },
    decorativeImage: createMediaField({ label: 'Decorative Image (left column)' }),
    primaryColor: { type: 'text', label: 'Brand Color (hex)' },
  },
  defaultProps,
  render: JoinCTARender,
}
