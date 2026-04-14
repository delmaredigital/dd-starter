/**
 * SummaryGrid — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { iconOptions } from './icons'
import { SummaryGridRender, defaultProps } from './SummaryGrid.render'
import type { SummaryGridProps } from './SummaryGrid.render'

export type { SummaryGridProps, SummaryCard } from './SummaryGrid.render'
export { SummaryGridRender, defaultProps } from './SummaryGrid.render'

export const SummaryGridConfig: ComponentConfig<SummaryGridProps> = {
  label: 'Summary Grid',
  fields: {
    heading: { type: 'text', label: 'Heading (empty = default)', placeholder: defaultProps.heading },
    cards: {
      type: 'array',
      label: 'Summary Cards',
      arrayFields: {
        iconName: { type: 'select', label: 'Icon', options: iconOptions },
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
      },
    },
  },
  defaultProps,
  render: SummaryGridRender,
}
