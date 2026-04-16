/**
 * CompetitionStructure — "How does the challenge work?" section.
 * Server-safe: no client-only imports.
 *
 * Figma source: file gsQOnwzRxVZA3Q6MMY1bnv, UNC frame 6272:33298
 * Heading 6373:7054, hero 6373:7055, team card 6373:7060,
 * age categories 6392:23708, rounds card 6373:7069, CTAs 6373:7090+7391
 *
 * Layout: heading → hero image w/ color overlay → info cards overlapping
 * hero bottom → full-width rounds card with divider lines → dual CTA buttons.
 *
 * 0.75× scale from Figma 1728px → 940px container, snapped to Tailwind stock.
 *
 * Shadow (Figma "Shadow Large", both cards):
 *   0 4px 6px -2px rgba(10,13,18,0.03), 0 12px 16px -4px rgba(10,13,18,0.08)
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, BRAND_DARK, HERO_OVERLAY, CTA_BG, CTA_TEXT, CTA2_BG, CTA2_TEXT, CTA2_BORDER, SURFACE_GREY } from './shared'
import { Groups, Category } from './icons'

const CARD_SHADOW = '0 4px 6px -2px rgba(10,13,18,0.03), 0 12px 16px -4px rgba(10,13,18,0.08)'

/* ── Types ──────────────────────────────────────────────── */

export interface InfoCardItem {
  name: string
  grades: string
}

export interface InfoCard {
  icon: MediaReference | null
  heading: string
  body: string
  items: InfoCardItem[]
}

export interface CompetitionStructureProps {
  heading: string
  heroImage: MediaReference | null
  heroOverlayOpacity: number
  infoCards: InfoCard[]
  ctaText: string
  ctaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
}

/* ── Defaults ───────────────────────────────────────────── */

export const defaultProps: CompetitionStructureProps = {
  heading: 'How does the challenge work?',
  heroImage: null,
  heroOverlayOpacity: 0.7,
  infoCards: [
    {
      icon: null,
      heading: 'Team size',
      body: 'Team size: 2-5 students per team (all team members must be from the same school)',
      items: [],
    },
    {
      icon: null,
      heading: 'Age Categories',
      body: '',
      items: [
        { name: 'Lower Primary School Category', grades: 'Grades K\u20132' },
        { name: 'Upper Primary School Category', grades: 'Grades 3\u20135' },
      ],
    },
  ],
  ctaText: 'Register Now!',
  ctaLink: '/register',
  secondaryCtaText: 'Join the league',
  secondaryCtaLink: '/league',
}

/* ── Render ──────────────────────────────────────────────── */

export function CompetitionStructureRender({
  heading: headingRaw,
  heroImage,
  heroOverlayOpacity,
  infoCards,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
}: CompetitionStructureProps) {
  const heading = headingRaw || defaultProps.heading
  const cards = infoCards ?? []
  const color = BRAND_DARK

  // Hero aspect ratio — drives both the image height (via CSS
  // aspect-ratio) and the cards' 40% overlap (via negative margin).
  // The trick: CSS margin-top % and aspect-ratio both resolve from
  // the same parent width, so calc(-40% * H/W) = 40% of the
  // hero's rendered height at any viewport. One ratio, two uses.
  const HERO_W = 1447
  const HERO_H = 456

  return (
    <section className="py-5 md:py-10 px-3 md:px-5">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-bold text-center text-2xl md:text-3xl leading-tight text-[#222] mb-5 md:mb-10"
        >
          {heading}
        </h2>

        {/* Hero image — Figma 1447×456 frame (aspect 3.173), 14px corners,
           overlay applied in CSS on top. Source image is expected to be
           pre-cropped to this frame's aspect with Figma's ~72% vertical
           pan baked in (see unc-challenge-hero-1920x640.webp: 1920×640 at
           3:1 with ~17px symmetric wiggle around the exact visible slice,
           so object-cover center-center renders the same faces Figma
           showed). No object-position needed. */}
        {/* Hero image — aspect 1447/456. Cards below overlap 45% of hero
            via negative margin. margin-top % is relative to parent width,
            same base as aspect-ratio — so calc(-45% * 456/1447) = 45% of
            the hero height at any viewport. Cards stay in flow.

            CRITICAL: bottom 45% of this image is covered by cards.
            When cropping hero images, ALL important content (faces, text,
            key details) MUST be in the top 55%. */}
        {heroImage?.url && (
          <div
            className="relative rounded-xl overflow-hidden"
            style={{ aspectRatio: `${HERO_W} / ${HERO_H}` }}
          >
            <img
              src={heroImage.url}
              alt={heroImage.alt || ''}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: `color-mix(in srgb, ${HERO_OVERLAY} ${Math.round(heroOverlayOpacity * 100)}%, transparent)`,
              }}
            />
          </div>
        )}

        {/* Info cards — overlap hero by 40% of hero height */}
        {/* Card: #F2F3F0, corners 14→10.5 ≈ rounded-xl, Shadow Large */}
        {/* Padding: L 44→33 ≈ px-8 (32px), T 29→22 ≈ pt-6 (24px) */}
        {cards.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10"
            style={{ marginTop: heroImage?.url ? `calc(-45% * ${HERO_H} / ${HERO_W})` : '0' }}
          >
            {cards.map((card, i) => (
              <div
                key={`card-${card.heading}-${i}`}
                className="rounded-xl px-8 pt-6 pb-6"
                style={{ backgroundColor: SURFACE_GREY, boxShadow: CARD_SHADOW }}
              >
                {i === 0 && <Groups className="w-11 h-11 mb-3 text-[#909090]" />}
                {i === 1 && <Category className="w-11 h-11 mb-3 text-[#909090]" />}
                {/* Card heading — Figma 25px Bold → text-lg */}
                <h3
                  className="font-bold mb-4 mt-0 text-lg leading-tight text-[#222]"
                >
                  {card.heading}
                </h3>

                {/* Plain text body */}
                {card.body && (
                  <p className="m-0 text-base text-[#222]">
                    {card.body}
                  </p>
                )}

                {/* Structured items (categories) */}
                {(card.items ?? []).map((item, j) => (
                  <div
                    key={`item-${item.name}-${j}`}
                    className={j < card.items.length - 1 ? 'mb-4 md:mb-8' : ''}
                  >
                    {/* Item name — Figma 22px SemiBold primaryColor → text-base */}
                    <div className="font-semibold text-base leading-tight" style={{ color }}>
                      {item.name}
                    </div>
                    {/* Item grades — Figma 18px Medium → text-sm */}
                    <p className="m-0 text-sm text-[#222]">
                      {item.grades}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/*
         * ⚠️ DO NOT REMOVE — Concentric circle bullet pattern for future reuse.
         * 15px outer ring (primaryColor @ 20%) + 8px inner dot (primaryColor solid):
         *
         *   <span className="shrink-0 mt-1 rounded-full flex items-center justify-center"
         *     style={{ width: '15px', height: '15px', backgroundColor: hexAlpha(primaryColor, 0.2) }}>
         *     <span className="rounded-full"
         *       style={{ width: '8px', height: '8px', backgroundColor: color }} />
         *   </span>
         */}

        {/* CTA buttons */}
        {(ctaText || secondaryCtaText) && (
          <div className="flex flex-wrap justify-center gap-5 md:gap-6 mt-5 md:mt-10">
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
    </section>
  )
}
