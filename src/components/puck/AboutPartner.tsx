/**
 * AboutPartner — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { AboutPartnerRender, defaultProps } from './AboutPartner.render'
import type { AboutPartnerProps } from './AboutPartner.render'

export type { AboutPartnerProps } from './AboutPartner.render'
export { AboutPartnerRender, defaultProps } from './AboutPartner.render'

export const AboutPartnerConfig: ComponentConfig<AboutPartnerProps> = {
  label: 'About Partner',
  fields: {
    heading: { type: 'text', label: 'Heading' },
    body: { type: 'textarea', label: 'Body Text' },
    ctaText: { type: 'text', label: 'CTA Button Text (leave empty to hide)' },
    ctaLink: { type: 'text', label: 'CTA Button Link' },
    primaryColor: { type: 'text', label: 'Brand Color (hex)' },
  },
  defaultProps,
  render: AboutPartnerRender,
}
