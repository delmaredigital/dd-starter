/**
 * ResponsiveImageSection — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { ResponsiveImageSectionRender, defaultProps } from './ResponsiveImageSection.render'
import type { ResponsiveImageSectionProps } from './ResponsiveImageSection.render'

export type { ResponsiveImageSectionProps } from './ResponsiveImageSection.render'
export { ResponsiveImageSectionRender, defaultProps } from './ResponsiveImageSection.render'

export const ResponsiveImageSectionConfig: ComponentConfig<ResponsiveImageSectionProps> = {
  label: 'Responsive Image Section',
  fields: {
    heading: { type: 'text', label: 'Heading (optional)' },
    desktopImage: createMediaField({ label: 'Desktop Image' }),
    mobileImage: createMediaField({ label: 'Mobile Image' }),
  },
  defaultProps,
  render: ResponsiveImageSectionRender,
}
