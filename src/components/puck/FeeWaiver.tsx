/**
 * FeeWaiver — full editor config with field definitions.
 * Content is hardcoded — identical across all competitions.
 * Only the icon and divider image are configurable.
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
    icon: createMediaField({ label: 'Info Icon' }),
    dividerImage: createMediaField({ label: 'Divider Line Image' }),
  },
  defaultProps,
  render: FeeWaiverRender,
}
