/**
 * CompetitionNav — full editor config with field definitions.
 * AlgoEd logo is hardcoded. Partner logo, nav links, and CTA are configurable.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { CompetitionNavRender, defaultProps } from './CompetitionNav.render'
import type { CompetitionNavProps } from './CompetitionNav.render'

export type { CompetitionNavProps, NavLinkItem } from './CompetitionNav.render'
export { CompetitionNavRender, defaultProps } from './CompetitionNav.render'

export const CompetitionNavConfig: ComponentConfig<CompetitionNavProps> = {
  label: 'Competition Nav',
  fields: {
    partnerLogo: createMediaField({ label: 'Partner Logo' }),
    partnerLink: { type: 'text', label: 'Partner Logo Link' },
    navLinks: {
      type: 'array',
      label: 'Navigation Links',
      arrayFields: {
        label: { type: 'text', label: 'Link Text' },
        href: { type: 'text', label: 'Link URL' },
      },
    },
    ctaText: { type: 'text', label: 'CTA Button Text' },
    ctaLink: { type: 'text', label: 'CTA Button Link' },
    secondaryCtaText: { type: 'text', label: 'Secondary CTA Text' },
    secondaryCtaLink: { type: 'text', label: 'Secondary CTA Link' },
  },
  defaultProps,
  render: CompetitionNavRender,
}
