/**
 * AboutLeague — wrapper over TwoColumnFeature with locked League-style settings.
 * Plain image, image-right, white background, primary heading color.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { TwoColumnFeatureRender } from './TwoColumnFeature.render'

export interface AboutLeagueProps {
  heading: string
  body: string
  featureImage: MediaReference | null
  ctaText: string
  ctaLink: string
}

export const defaultProps: AboutLeagueProps = {
  heading: 'About the World STEM League',
  body: '',
  featureImage: null,
  ctaText: 'LEARN MORE',
  ctaLink: '#',
}

export function AboutLeagueRender(props: AboutLeagueProps) {
  return (
    <TwoColumnFeatureRender
      {...props}
      ctaVariant="filled"
      secondaryCtaText=""
      secondaryCtaLink=""
      imageStyle="plain"
      layout="image-right"
      bgColor=""
      headingColor="primary"
    />
  )
}
