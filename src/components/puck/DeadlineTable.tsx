/**
 * DeadlineTable — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { DeadlineTableRender, defaultProps } from './DeadlineTable.render'
import type { DeadlineTableProps } from './DeadlineTable.render'

export type { DeadlineTableProps, TierItem } from './DeadlineTable.render'
export { DeadlineTableRender, defaultProps } from './DeadlineTable.render'

export const DeadlineTableConfig: ComponentConfig<DeadlineTableProps> = {
  label: 'Deadline Table',
  fields: {
    heading: { type: 'text', label: 'Heading (empty = default)', placeholder: defaultProps.heading },
    tiers: {
      type: 'array',
      label: 'Pricing Tiers',
      arrayFields: {
        title: { type: 'text', label: 'Tier Title (e.g. Priority Deadline)' },
        deadline: { type: 'text', label: 'Deadline Date' },
        fee: { type: 'text', label: 'Fee (e.g. US$30 per student)' },
        variant: {
          type: 'radio',
          label: 'Style Variant',
          options: [
            { label: 'Priority (brand bg, white text)', value: 'priority' },
            { label: 'Regular (light bg, brand title)', value: 'regular' },
            { label: 'Late (white bg, black text)', value: 'late' },
          ],
        },
      },
    },
    featureImage: createMediaField({ label: 'Feature Image (right column)' }),
    ctaText: { type: 'text', label: 'CTA Button Text (leave empty to hide)' },
    ctaLink: { type: 'text', label: 'CTA Button Link' },
  },
  defaultProps,
  render: DeadlineTableRender,
}
