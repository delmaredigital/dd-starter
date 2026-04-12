/**
 * FeeWaiver — full editor config with field definitions.
 * Content is hardcoded — identical across all competitions.
 * Divider line is CSS (1px #D9D9D9), no image needed.
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
  },
  defaultProps,
  render: FeeWaiverRender,
}
