/**
 * FosteringSection — wrapper over TwoColumnFeature with locked settings.
 * Plain image, image-right, white background, dark heading, filled CTA + secondary.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { TwoColumnFeatureRender } from './TwoColumnFeature.render'

export interface FosteringSectionProps {
  heading: string
  body: string
  featureImage: MediaReference | null
  ctaText: string
  ctaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
}

export const defaultProps: FosteringSectionProps = {
  heading: 'Distinguish Yourself at {{Competition Name}} Competition',
  body: '',
  featureImage: null,
  ctaText: 'REGISTER NOW!',
  ctaLink: '#',
  secondaryCtaText: 'JOIN THE LEAGUE',
  secondaryCtaLink: '#',
}

export function FosteringSectionRender(props: FosteringSectionProps) {
  return (
    <TwoColumnFeatureRender
      {...props}
      ctaVariant="filled"
      imageStyle="plain"
      layout="image-right"
      bgColor=""
      headingColor="dark"
    />
  )
}
