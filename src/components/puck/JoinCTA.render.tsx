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
import { CompetitionCTA, safeHex } from './shared'

/* ── Types ──────────────────────────────────────────────── */

export interface JoinCTAProps {
  heading: string
  body: string
  photo: MediaReference | null
  ctaText: string
  ctaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  primaryColor: string
}

/* ── Defaults ───────────────────────────────────────────── */

export const defaultProps: JoinCTAProps = {
  heading: 'Join the Challenge',
  body: "This competition is more than a contest; it\u2019s a gateway to the world of engineering innovation.\n\nRegister now to begin your journey into the exciting field of engineering, where you\u2019ll apply creative problem-solving and technical skills to real-world challenges.",
  photo: null,
  ctaText: 'Register Now!',
  ctaLink: '/register',
  secondaryCtaText: 'Join the league',
  secondaryCtaLink: '/league',
  primaryColor: '#13294C',
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
  primaryColor,
}: JoinCTAProps) {
  const heading = headingRaw || defaultProps.heading
  const body = bodyRaw || defaultProps.body
  const color = safeHex(primaryColor)

  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-2.5 md:px-5 lg:px-0">
        {/* Two-column: globe frame (left) + text (right) */}
        {/* Figma gap frame→text: 52→39px ≈ gap-10 (40px) */}
        {/* Figma: globe 42.6% / text 31.4% ≈ 1.35:1 ratio */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 items-center">
          {/* Globe frame — center-anchored composition.
             The map img drives the container's height via its intrinsic
             width/height (1450×866 → aspect 1.6744, the source vector's
             natural shape — close to Winkel Tripel, not cropped, not
             stretched, no object-fit trickery). Container has no explicit
             aspect-ratio: it inherits from the map img's attributes.

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
             or pixel-exact.

             Future next/image: swap the map <img> for <Image src=
             "/..." width={1450} height={866} />. Intrinsic-dimension
             mode preserves the flow-sized behavior; no other code
             changes needed. Same for the photo img: <Image src={photo.
             url} width={photo.width} height={photo.height} />. */}
          <div className="relative">
            <img
              src="/competition-assets/join-globe-frame-map.png"
              alt=""
              width={1450}
              height={866}
              loading="lazy"
              className="block w-full h-auto pointer-events-none"
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
              <img
                src="/competition-assets/join-globe-frame-circles.svg"
                alt=""
                className="block w-full h-auto pointer-events-none"
              />
              {photo?.url && (
                <img
                  src={photo.url}
                  alt={photo.alt || ''}
                  loading="lazy"
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
            {/* Heading — 40px Bold #222, leading 130% → text-3xl leading-[1.3] */}
            <h2
              className="font-bold mt-0 mb-4 text-3xl leading-[1.3]"
              style={{ color: '#222' }}
            >
              {heading}
            </h2>
            {/* Body — 20px Regular #222, leading 150% → text-[15px], inherits global 1.625 */}
            {/* Figma 150% vs global 1.625 — close enough, 0.125 delta at 15px = 1.9px */}
            <p
              className="whitespace-pre-line mb-6 text-[15px]"
              style={{ color: '#222' }}
            >
              {body}
            </p>
            {/* CTA buttons — same pattern as CompetitionStructure */}
            {(ctaText || secondaryCtaText) && (
              <div className="flex flex-wrap gap-4">
                {ctaText && (
                  <CompetitionCTA
                    text={ctaText}
                    href={ctaLink}
                    bgColor={color}
                    textColor="#ffffff"
                  />
                )}
                {secondaryCtaText && (
                  <CompetitionCTA
                    text={secondaryCtaText}
                    href={secondaryCtaLink}
                    bgColor="transparent"
                    textColor={color}
                    border={`1px solid ${color}`}
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
