/**
 * EligibilityStrip — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { EligibilityStripRender, defaultProps } from './EligibilityStrip.render'
import type { EligibilityStripProps } from './EligibilityStrip.render'

export type { EligibilityStripProps } from './EligibilityStrip.render'
export { EligibilityStripRender, defaultProps } from './EligibilityStrip.render'

export const EligibilityStripConfig: ComponentConfig<EligibilityStripProps> = {
  label: 'Eligibility Strip',
  fields: {
    leftText: { type: 'text', label: 'Left Text' },
    rightText: { type: 'text', label: 'Right Text' },
    leftIcon: createMediaField({ label: 'Left Icon' }),
    rightIcon: createMediaField({ label: 'Right Icon' }),
  },
  defaultProps,
  render: EligibilityStripRender,
}
