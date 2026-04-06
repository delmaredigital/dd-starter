/**
 * CompetitionFooter — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { CompetitionFooterRender, defaultProps } from './CompetitionFooter.render'
import type { CompetitionFooterProps } from './CompetitionFooter.render'

export type { CompetitionFooterProps } from './CompetitionFooter.render'
export { CompetitionFooterRender, defaultProps } from './CompetitionFooter.render'

export const CompetitionFooterConfig: ComponentConfig<CompetitionFooterProps> = {
  label: 'Competition Footer',
  fields: {
    primaryColor: { type: 'text', label: 'Background Color (hex)' },
    privacyLink: { type: 'text', label: 'Privacy Policy Link' },
    termsLink: { type: 'text', label: 'Terms & Conditions Link' },
    copyrightText: { type: 'text', label: 'Copyright Text' },
  },
  defaultProps,
  render: CompetitionFooterRender,
}
