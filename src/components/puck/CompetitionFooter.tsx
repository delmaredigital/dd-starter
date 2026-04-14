/**
 * CompetitionFooter — full editor config with field definitions.
 * Color comes from root-level --primary-dark CSS variable.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { CompetitionFooterRender, defaultProps } from './CompetitionFooter.render'
import type { CompetitionFooterProps } from './CompetitionFooter.render'

export type { CompetitionFooterProps } from './CompetitionFooter.render'
export { CompetitionFooterRender, defaultProps } from './CompetitionFooter.render'

export const CompetitionFooterConfig: ComponentConfig<CompetitionFooterProps> = {
  label: 'Competition Footer',
  fields: {},
  defaultProps,
  render: CompetitionFooterRender,
}
