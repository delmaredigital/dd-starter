/**
 * CompetitionFooter — full editor config with field definitions.
 * Only primaryColor is configurable — links and copyright are shared across all competitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { CompetitionFooterRender, defaultProps } from './CompetitionFooter.render'
import type { CompetitionFooterProps } from './CompetitionFooter.render'

export type { CompetitionFooterProps } from './CompetitionFooter.render'
export { CompetitionFooterRender, defaultProps } from './CompetitionFooter.render'

export const CompetitionFooterConfig: ComponentConfig<CompetitionFooterProps> = {
  label: 'Competition Footer',
  fields: {
    primaryColor: { type: 'text', label: 'Brand Color (hex)' },
  },
  defaultProps,
  render: CompetitionFooterRender,
}
