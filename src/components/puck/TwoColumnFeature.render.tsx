/**
 * TwoColumnFeature — render function and types.
 * Server-safe: no client-only imports.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { FramedImage } from './FramedImage'
import { CompetitionCTA, RichText, BRAND_DARK, CTA_BG, CTA_TEXT, CTA2_BG, CTA2_TEXT, CTA2_BORDER } from './shared'

// Plain <img> instead of next/image — deliberate, do not switch back.
//
// We tried to use next/image with R2 CDN URLs but it's fundamentally incompatible
// with Cloudflare Polish. Next.js <Image> forces all images through /_next/image
// proxy on the app server, injecting Router Vary headers that Cloudflare sees as
// "vary_header_present" and refuses to optimize. There's no way to opt out of the
// proxy while keeping <Image> — the behavior appears to be an intentional design
// choice by Next.js (their own image optimization competes with Cloudflare's).
//
// We chose Cloudflare Polish over next/image. Result: 3.5MB PNG → 391KB WebP at
// the edge, automatic format negotiation, zero app-server image processing.
// Card frame uses FramedImage (client component, deferred frame on load).

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
  headingColor: 'primary' | 'dark'
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
  headingColor: 'primary',
}

export function TwoColumnFeatureRender({
  heading, body, ctaText, ctaLink, ctaVariant, secondaryCtaText, secondaryCtaLink,
  featureImage, imageStyle, layout, bgColor, headingColor,
}: TwoColumnFeatureProps) {
  const color = BRAND_DARK
  const isImageRight = layout === 'image-right'

  const textColumn = (
    <div className="flex flex-col justify-center items-start">
      <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-5 md:mb-6" style={{ color: headingColor === 'primary' ? color : '#222' }}>{heading}</h2>
      <RichText className="text-base mb-5 md:mb-6 text-[#222] md:text-justify">{body}</RichText>
      <div className="flex flex-wrap gap-5 md:gap-6">
        {ctaVariant === 'outline'
          ? <CompetitionCTA text={ctaText} href={ctaLink} bgColor={CTA2_BG} textColor={CTA2_TEXT} border={`1px solid ${CTA2_BORDER}`} />
          : <CompetitionCTA text={ctaText} href={ctaLink} bgColor={CTA_BG} textColor={CTA_TEXT} />
        }
        <CompetitionCTA text={secondaryCtaText} href={secondaryCtaLink} bgColor={CTA2_BG} textColor={CTA2_TEXT} border={`1px solid ${CTA2_BORDER}`} />
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
        isCard ? (
          <FramedImage src={featureImage.url} alt={featureImage.alt || ''} width={featureImage.width} height={featureImage.height} />
        ) : (
          <img
            src={featureImage.url}
            alt={featureImage.alt || ''}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )
      )}
    </div>
  )

  return (
    <section className="py-5 md:py-10" style={bgColor ? { backgroundColor: bgColor } : undefined}>
      <div className="max-w-6xl mx-auto px-3 md:px-5 lg:px-0">
        <div className={`grid grid-cols-1 gap-5 lg:gap-10 lg:items-center ${isImageRight ? 'lg:grid-cols-[3fr_2fr]' : 'lg:grid-cols-[2fr_3fr]'}`}>
          {isImageRight ? <>{textColumn}{imageColumn}</> : <>{imageColumn}{textColumn}</>}
        </div>
      </div>
    </section>
  )
}
