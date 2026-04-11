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
  heading,
  body,
  photo,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  primaryColor,
}: JoinCTAProps) {
  const color = safeHex(primaryColor)

  return (
    <section className="py-10">
      <div className="max-w-[940px] mx-auto px-2.5 md:px-5 lg:px-0">
        {/* Two-column: globe frame (left) + text (right) */}
        {/* Figma gap frame→text: 52→39px ≈ gap-10 (40px) */}
        {/* Figma: globe 42.6% / text 31.4% ≈ 1.35:1 ratio */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 items-center">
          {/* Globe frame — layered composition:
             1. Map PNG (68KB pngquant, gray dotted world map, cover-scaled to frame)
             2. Circles SVG (448B, 2 outline rings + 3 dots, positioned at Figma %)
             3. Photo div with box-shadow halo (Figma drop-shadow 1.44/27.34 rgba(0,0,0,0.2))
          */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '736 / 498' }}>
            <img
              src="/competition-assets/join-globe-frame-map.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            {/* Circles: Figma Group 1000006325 at (171.45, 49.46) 412.95×412.95 in 736×498 frame */}
            <img
              src="/competition-assets/join-globe-frame-circles.svg"
              alt=""
              className="absolute pointer-events-none"
              style={{ left: '23.29%', top: '9.93%', width: '56.11%', height: '82.92%' }}
            />
            {/* Photo circle — Figma inset: 21.49% 28.26% 18.47% 31.11% */}
            {photo?.url && (
              <div
                className="absolute rounded-full overflow-hidden"
                style={{
                  top: '21.49%', right: '28.26%', bottom: '18.47%', left: '31.11%',
                  boxShadow: '1px 1px 27px rgba(0, 0, 0, 0.2)',
                }}
              >
                <img
                  src={photo.url}
                  alt={photo.alt || ''}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
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
                    padding="14px 40px"
                  />
                )}
                {secondaryCtaText && (
                  <CompetitionCTA
                    text={secondaryCtaText}
                    href={secondaryCtaLink}
                    bgColor="transparent"
                    textColor={color}
                    padding="14px 40px"
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
