/**
 * JoinCTA — "Join the Challenge" section with globe frame + circular photo.
 * Server-safe: no client-only imports.
 *
 * Figma source: file gsQOnwzRxVZA3Q6MMY1bnv, UNC frame 6272:33298
 * Text group 6373:7050, globe frame 6373:8120, photo ellipse 6373:8591
 *
 * Layout: two-column — globe frame with circular photo (left) + heading,
 * body text, and CTA buttons (right).
 *
 * The globe frame SVG (world map + concentric circles + dots) is a shared
 * static asset at /competition-assets/join-globe-frame.svg.
 * Only the circular photo inside is per-competition (MediaReference).
 *
 * 0.75× scale from Figma 1728px → 940px container, snapped to Tailwind stock.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, BRAND_DARK, BRAND_BRIGHT, CTA_BG, CTA_TEXT, CTA2_BG, CTA2_TEXT, CTA2_BORDER } from './shared'

/* ── Types ──────────────────────────────────────────────── */

export interface JoinCTAProps {
  heading: string
  body: string
  photo: MediaReference | null
  ctaText: string
  ctaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  circleSource: string
  mapSource: string
  mapIntensity: number
}

/* ── Defaults ───────────────────────────────────────────── */

export const defaultProps: JoinCTAProps = {
  heading: 'Join the Challenge',
  body: "This competition is more than a contest; it\u2019s a gateway to the world of STEM innovation.\n\nRegister now to begin your journey into STEM, where you\u2019ll apply creative problem-solving and technical skills to real-world challenges.",
  photo: null,
  ctaText: 'Register Now!',
  ctaLink: '/register',
  secondaryCtaText: 'Join the league',
  secondaryCtaLink: '/league',
  circleSource: 'dark' as const,
  mapSource: 'dark' as const,
  mapIntensity: 30,
}

/* ── Render ──────────────────────────────────────────────── */

export function JoinCTARender({
  heading: headingRaw,
  body: bodyRaw,
  photo,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  circleSource,
  mapSource,
  mapIntensity,
}: JoinCTAProps) {
  const heading = headingRaw || defaultProps.heading
  const body = bodyRaw || defaultProps.body
  const color = BRAND_DARK
  const circleColor = (circleSource ?? 'dark') === 'bright' ? BRAND_BRIGHT : BRAND_DARK
  const mapColor = (mapSource ?? 'dark') === 'bright' ? BRAND_BRIGHT : BRAND_DARK
  const mapPct = mapIntensity ?? 30

  return (
    <section className="py-5 md:py-10">
      <div className="max-w-5xl mx-auto px-3 md:px-5 lg:px-0">
        {/* Two-column: globe frame (left) + text (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-5 md:gap-10 items-center">
          {/* Globe frame — center-anchored composition.
             The map is a CSS-masked div: SVG used as mask-image with
             backgroundColor set to 10% primaryColor tint. The SVG's
             viewBox is 725×433 (aspect 1.6744, the source vector's
             natural shape — close to Winkel Tripel, not cropped, not
             stretched). aspectRatio set explicitly on the div since
             mask-image divs have no intrinsic dimensions.

             Circles wrapper and photo are absolutely centered via
             50%/50% + translate(-50%, -50%). Pure geometric centering —
             Figma's ~1.4% off-center bias on the circles and ~0.55px
             drift between its white ring and photo centers are sub-pixel
             noise, collapsed here to perfect concentricity.

             Size math:
               Circles wrapper: 50% of container width (clean round
                 number; ~83% of container height, preserving Figma's
                 breathing-room proportion).
               Photo: 72.4% of circles wrapper — the only value that
                 controls whether the SVG's white ring stays visible.
                 The SVG's white circle sits at r=160.45/413 = 77.7% of
                 wrapper. Photo must stay smaller than that or the ring
                 disappears. 72.4% leaves a ~5.3% visible gap = the
                 white border. Recompute if the circles SVG is ever
                 re-exported with a different white circle radius.

             Circles SVG (1.3KB, Figma export of node 6373:8587, photo-
             stripped): 2 navy rings, 3 dots, white filled circle with
             Figma's real drop-shadow filter (dx/dy 1.439, stdDeviation
             13.669, alpha 0.2). Shadow lives on the SVG white circle,
             not the photo — scales with SVG viewBox at every viewport.

             The photo is CSS-clipped to a circle via rounded-full —
             uploaded image can be any shape/size, object-cover fills
             the circle cleanly. Source image doesn't need to be round
             or pixel-exact. */}
          <div className="relative">
            <div
              className="block w-full pointer-events-none"
              style={{
                aspectRatio: '725 / 433',
                backgroundColor: `color-mix(in srgb, ${mapColor} ${mapPct}%, white)`,
                WebkitMaskImage: 'url(/competition-assets/join-globe-frame-map.svg)',
                WebkitMaskSize: '100% 100%',
                maskImage: 'url(/competition-assets/join-globe-frame-map.svg)',
                maskSize: '100% 100%',
              }}
            />
            <div
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50%',
                aspectRatio: '1 / 1',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="413" height="413" fill="none" viewBox="0 0 413 413" className="block w-full h-auto pointer-events-none" style={{ color: circleColor }}>
                <g filter="url(#gc-shadow)"><circle cx="206.503" cy="206.503" r="160.451" fill="#fff"/><circle cx="206.503" cy="206.503" r="159.732" stroke="#fff" strokeWidth="1.439"/></g>
                <circle cx="206.5" cy="206.5" r="205.061" stroke="currentColor" strokeWidth="2.878"/>
                <circle cx="206.502" cy="206.502" r="182.961" stroke="currentColor" strokeWidth="1.03"/>
                <circle cx="86.337" cy="38.851" r="7.195" fill="currentColor"/>
                <circle cx="389.974" cy="195.705" r="7.195" fill="currentColor"/>
                <circle cx="162.612" cy="405.804" r="7.195" fill="currentColor"/>
                <defs><filter id="gc-shadow" width="375.585" height="375.585" x="20.15" y="20.15" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="1.439" dy="1.439"/><feGaussianBlur stdDeviation="13.669"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs>
              </svg>
              {photo?.url && (
                <img
                  src={photo.url}
                  alt={photo.alt || ''}
                  className="absolute rounded-full object-cover pointer-events-none"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '72.4%',
                    aspectRatio: '1 / 1',
                  }}
                />
              )}
            </div>
          </div>

          {/* Text column */}
          <div className="flex flex-col justify-center items-start">
            <h2
              className="font-bold mt-0 mb-5 md:mb-6 text-2xl md:text-3xl leading-tight text-[#222]"
            >
              {heading}
            </h2>
            <p
              className="whitespace-pre-line mb-5 md:mb-6 text-base text-[#222]"
            >
              {body}
            </p>
            {(ctaText || secondaryCtaText) && (
              <div className="flex flex-wrap gap-5 md:gap-6">
                {ctaText && (
                  <CompetitionCTA
                    text={ctaText}
                    href={ctaLink}
                    bgColor={CTA_BG}
                    textColor={CTA_TEXT}
                  />
                )}
                {secondaryCtaText && (
                  <CompetitionCTA
                    text={secondaryCtaText}
                    href={secondaryCtaLink}
                    bgColor={CTA2_BG}
                    textColor={CTA2_TEXT}
                    border={`1px solid ${CTA2_BORDER}`}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
