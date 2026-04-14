/**
 * EligibilitySection — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { EligibilitySectionRender, defaultProps } from './EligibilitySection.render'
import type { EligibilitySectionProps } from './EligibilitySection.render'

export type { EligibilitySectionProps } from './EligibilitySection.render'
export { EligibilitySectionRender, defaultProps } from './EligibilitySection.render'

export const EligibilitySectionConfig: ComponentConfig<EligibilitySectionProps> = {
  label: 'Eligibility Section',
  fields: {
    introText: { type: 'textarea', label: 'Intro Text' },
    items: {
      type: 'array',
      label: 'Bullet Items',
      arrayFields: {
        value: { type: 'text', label: 'Item Text' },
      },
      defaultItemProps: { value: 'New item' },
    },
  },
  defaultProps,
  render: EligibilitySectionRender,
}
