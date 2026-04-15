/**
 * AboutPartnerV2 — editor config. Wraps TwoColumnFeature with locked About-style settings.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { AboutPartnerV2Render, defaultProps } from './AboutPartnerV2.render'
import type { AboutPartnerV2Props } from './AboutPartnerV2.render'

export type { AboutPartnerV2Props } from './AboutPartnerV2.render'
export { AboutPartnerV2Render, defaultProps } from './AboutPartnerV2.render'

export const AboutPartnerV2Config: ComponentConfig<AboutPartnerV2Props> = {
  label: 'About Partner V2',
  fields: {
    heading: { type: 'text', label: 'Heading' },
    body: { type: 'richtext', label: 'Body Text' },
    featureImage: createMediaField({ label: 'School Photo (card frame)' }),
    ctaText: { type: 'text', label: 'CTA Text (empty to hide)' },
    ctaLink: { type: 'text', label: 'CTA Link' },
  },
  defaultProps,
  render: AboutPartnerV2Render,
}
