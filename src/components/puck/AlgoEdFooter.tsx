/**
 * AlgoEdFooter — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { AlgoEdFooterRender, defaultProps } from './AlgoEdFooter.render'
import type { AlgoEdFooterProps } from './AlgoEdFooter.render'

export type { AlgoEdFooterProps } from './AlgoEdFooter.render'
export { AlgoEdFooterRender, defaultProps } from './AlgoEdFooter.render'

export const AlgoEdFooterConfig: ComponentConfig<AlgoEdFooterProps> = {
  label: 'AlgoEd Footer',
  fields: {
    heading: { type: 'text', label: 'Heading (e.g. "About")' },
    description: { type: 'textarea', label: 'Description' },
    ctaText: { type: 'text', label: 'CTA Button Text (leave empty to hide)' },
    ctaLink: { type: 'text', label: 'CTA Button Link' },
    primaryColor: { type: 'text', label: 'Brand Color (hex)' },
    logo: createMediaField({ label: 'AlgoEd Logo' }),
    backgroundImage: createMediaField({ label: 'Left Column Background Image' }),
  },
  defaultProps,
  render: AlgoEdFooterRender,
}
