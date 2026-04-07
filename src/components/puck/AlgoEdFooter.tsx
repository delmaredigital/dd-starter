/**
 * AlgoEdFooter — full editor config with field definitions.
 * Text content is hardcoded (identical across all competitions).
 * Only primaryColor, logo, and backgroundImage are configurable.
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
    primaryColor: { type: 'text', label: 'Brand Color (hex)' },
    logo: createMediaField({ label: 'AlgoEd Logo' }),
    backgroundImage: createMediaField({ label: 'Left Column Background Image' }),
  },
  defaultProps,
  render: AlgoEdFooterRender,
}
