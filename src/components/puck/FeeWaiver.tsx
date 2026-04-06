/**
 * FeeWaiver — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { FeeWaiverRender, defaultProps } from './FeeWaiver.render'
import type { FeeWaiverProps } from './FeeWaiver.render'

export type { FeeWaiverProps } from './FeeWaiver.render'
export { FeeWaiverRender, defaultProps } from './FeeWaiver.render'

export const FeeWaiverConfig: ComponentConfig<FeeWaiverProps> = {
  label: 'Fee Waiver',
  fields: {
    heading: { type: 'text', label: 'Heading' },
    body: { type: 'textarea', label: 'Body Text' },
    icon: createMediaField({ label: 'Icon' }),
    dividerImage: createMediaField({ label: 'Divider Image (optional line above)' }),
  },
  defaultProps,
  render: FeeWaiverRender,
}
