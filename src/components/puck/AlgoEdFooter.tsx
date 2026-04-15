/**
 * AlgoEdFooter — full editor config with field definitions.
 * Text content is hardcoded (identical across all competitions).
 * Only brand color (dark/bright) is configurable.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createBrandPickerField } from './fields'
import { AlgoEdFooterRender, defaultProps } from './AlgoEdFooter.render'
import type { AlgoEdFooterProps } from './AlgoEdFooter.render'

export type { AlgoEdFooterProps } from './AlgoEdFooter.render'
export { AlgoEdFooterRender, defaultProps } from './AlgoEdFooter.render'

export const AlgoEdFooterConfig: ComponentConfig<AlgoEdFooterProps> = {
  label: 'AlgoEd Footer',
  fields: {
    bgSource: createBrandPickerField({ label: 'Background Color' }),
  },
  defaultProps,
  render: AlgoEdFooterRender,
}
