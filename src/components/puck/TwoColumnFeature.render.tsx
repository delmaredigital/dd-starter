/**
 * TwoColumnFeature — render function and types.
 * Server-safe: no client-only imports.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { FramedPayloadImage } from './FramedPayloadImage'
import { PayloadImage } from './PayloadImage'
import { CompetitionCTA, RichText, safeHex } from './shared'

// The two-column layout collapses to 1col under lg (1024px). Above, each
// image column is roughly half of the 940px container → ~460px. Tells the
// browser to pick the smallest srcset candidate that fits.
const TWO_COL_IMAGE_SIZES = '(max-width: 1023px) 100vw, 460px'

export interface TwoColumnFeatureProps {
  heading: string
  body: string
  ctaText: string
  ctaLink: string
  ctaVariant: 'filled' | 'outline'
  secondaryCtaText: string
  secondaryCtaLink: string
  featureImage: MediaReference | null
  imageStyle: 'plain' | 'card'
  layout: 'image-right' | 'image-left'
  bgColor: string
  primaryColor: string
}

export const defaultProps: TwoColumnFeatureProps = {
  heading: 'Section Heading',
  body: 'Section body text goes here.',
  ctaText: 'Competition Portal',
  ctaLink: '/portal',
  ctaVariant: 'filled',
  secondaryCtaText: '',
  secondaryCtaLink: '',
  featureImage: null,
  imageStyle: 'plain',
  layout: 'image-right',
  bgColor: '',
  primaryColor: '#a31f35',
}

export function TwoColumnFeatureRender({
  heading, body, ctaText, ctaLink, ctaVariant, secondaryCtaText, secondaryCtaLink,
  featureImage, imageStyle, layout, bgColor, primaryColor,
}: TwoColumnFeatureProps) {
  const color = safeHex(primaryColor)
  const isImageRight = layout === 'image-right'

  const textColumn = (
    <div className="flex flex-col justify-center items-start">
      <h2 className="text-3xl font-bold leading-[1.3] mb-6 text-[#333]">{heading}</h2>
      <RichText html={body} className="text-[15px] mb-6 text-[#333]" />
      <div className="flex flex-wrap gap-4">
        {ctaVariant === 'outline'
          ? <CompetitionCTA text={ctaText} href={ctaLink} bgColor="transparent" textColor={color} border={`1px solid ${color}`} />
          : <CompetitionCTA text={ctaText} href={ctaLink} bgColor={color} textColor="#ffffff" />
        }
        <CompetitionCTA text={secondaryCtaText} href={secondaryCtaLink} bgColor="transparent" textColor={color} border={`1px solid ${color}`} />
      </div>
    </div>
  )

  const isCard = imageStyle === 'card'
  // Card sizing mode — intrinsic, not fixed-aspect.
  //
  // Figma's TwoColumnFeature cards are drawn at instance-specific aspect
  // ratios: e.g. UNC about-unc at 419×328 (1.277), STEM League about-league
  // at 344×231 (1.489). These aren't standard ratios; they're whatever the
  // designer chose per instance, with `object-cover` cropping the image to
  // the designer's box.
  //
  // Our implementation instead lets the uploaded image drive the card's
  // intrinsic aspect (`width: 100%; height: auto`). Pros: "what you upload
  // is what you see", zero editor cognitive load, no crop surprises. Cons:
  // cards across pages may have different proportions depending on who
  // uploaded what, and we diverge from Figma's per-instance frame choices.
  //
  // This divergence was evaluated 2026-04-11. Decision: defer. Figma-exact
  // parity is not a product goal, and the intrinsic approach is fine for
  // the current 2-page scale. If we later want design-system-level frame
  // consistency, two canonical options:
  //
  //   1. Preset enum (4:3, 3:2, 16:9, 1:1) — `cardFrame` select field,
  //      conditional via `resolveFields`, render with `<Image fill>` +
  //      `object-cover` inside an `aspectRatio` box. Idiomatic for visual
  //      page builders (Builder.io, Storyblok pattern). Approximates
  //      Figma but not pixel-exact.
  //
  //   2. Free-form aspect prop — arbitrary width:height per instance.
  //      Pixel-exact but worse editor UX.
  //
  // Either path needs a data migration to set the frame per existing card
  // instance, and should probably be applied site-wide, not just to this
  // component, so wait until there are enough components involved to
  // make a single design-system decision.
  // max-w-sm (384) ≈ the 40% grid column on a 940 content area
  // (940 × 0.4 ≈ 376). Caps the image when stacked so it doesn't
  // exceed its desktop width. Ratio source: Figma About League row
  // (node 6373:8044), composite image 626 vs text 801 ≈ 56:44,
  // rounded to 60/40. See shared.tsx for the 0.75 Figma→CSS scale.
  //
  // mx-auto: parent is a grid (not flex), so the cell doesn't
  // auto-center narrower children. When max-w-sm caps the div
  // below cell width on stacked viewports, auto margins center it.
  const imageColumn = (
    <div className="w-full max-w-sm mx-auto">
      {featureImage?.url && (
        isCard
          ? <FramedPayloadImage media={featureImage} sizes={TWO_COL_IMAGE_SIZES} />
          : <PayloadImage media={featureImage} sizes={TWO_COL_IMAGE_SIZES} />
      )}
    </div>
  )

  return (
    <section className="py-10" style={bgColor ? { backgroundColor: bgColor } : undefined}>
      <div className="max-w-[940px] mx-auto px-5 lg:px-0">
        <div className={`grid grid-cols-1 gap-6 lg:gap-12 lg:items-center ${isImageRight ? 'lg:grid-cols-[3fr_2fr]' : 'lg:grid-cols-[2fr_3fr]'}`}>
          {isImageRight ? <>{textColumn}{imageColumn}</> : <>{imageColumn}{textColumn}</>}
        </div>
      </div>
    </section>
  )
}
