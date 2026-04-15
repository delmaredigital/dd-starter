/**
 * AboutLeague — editor config. Wraps TwoColumnFeature with locked League-style settings.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { AboutLeagueRender, defaultProps } from './AboutLeague.render'
import type { AboutLeagueProps } from './AboutLeague.render'

export type { AboutLeagueProps } from './AboutLeague.render'
export { AboutLeagueRender, defaultProps } from './AboutLeague.render'

export const AboutLeagueConfig: ComponentConfig<AboutLeagueProps> = {
  label: 'About League',
  fields: {
    heading: { type: 'text', label: 'Heading (empty = default)', placeholder: defaultProps.heading },
    body: { type: 'richtext', label: 'Body Text' },
    featureImage: createMediaField({ label: 'League Photo' }),
    ctaText: { type: 'text', label: 'CTA Text (empty to hide)' },
    ctaLink: { type: 'text', label: 'CTA Link' },
  },
  defaultProps,
  render: AboutLeagueRender,
}
