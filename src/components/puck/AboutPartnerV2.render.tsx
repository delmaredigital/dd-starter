/**
 * AboutPartnerV2 — wrapper over TwoColumnFeature with locked Host about-style settings.
 * Card image, image-left, grey background, primary heading color.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { TwoColumnFeatureRender } from './TwoColumnFeature.render'
import { SURFACE_GREY } from './shared'

export interface AboutPartnerV2Props {
  heading: string
  body: string
  featureImage: MediaReference | null
  ctaText: string
  ctaLink: string
}

export const defaultProps: AboutPartnerV2Props = {
  heading: '',
  body: '',
  featureImage: null,
  ctaText: 'LEARN MORE',
  ctaLink: '#',
}

export function AboutPartnerV2Render(props: AboutPartnerV2Props) {
  return (
    <TwoColumnFeatureRender
      {...props}
      ctaVariant="outline"
      secondaryCtaText=""
      secondaryCtaLink=""
      imageStyle="card"
      layout="image-left"
      bgColor={SURFACE_GREY}
      headingColor="primary"
    />
  )
}
