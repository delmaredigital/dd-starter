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
import { CompetitionCTA, safeHex, hexAlpha } from './shared'
import { Groups, Category, Diversity2 } from './icons'

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

export interface RoundDetail {
  label: string
  text: string
}

export interface RoundItem {
  title: string
  items: RoundDetail[]
}

export interface CompetitionStructureProps {
  heading: string
  heroImage: MediaReference | null
  heroOverlayColor: string
  heroOverlayOpacity: number
  infoCards: InfoCard[]
  roundsIcon: MediaReference | null
  roundsHeading: string
  rounds: RoundItem[]
  ctaText: string
  ctaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  primaryColor: string
}

/* ── Defaults ───────────────────────────────────────────── */

export const defaultProps: CompetitionStructureProps = {
  heading: 'How does the challenge work?',
  heroImage: null,
  heroOverlayColor: '#13294C',
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
  roundsIcon: null,
  roundsHeading: 'What do teams need to do?',
  rounds: [
    {
      title: 'Preliminary round: Test',
      items: [
        {
          label: 'Middle School Category:',
          text: 'No deep knowledge of any particular subject required. The test will focus on general knowledge, real problems, and critical thinking.',
        },
        {
          label: 'High School Category:',
          text: 'Requires basic biology, chemistry, physics, and math knowledge to solve problems. The test will focus on critical thinking and real world applications.',
        },
      ],
    },
    {
      title: 'Semi-final round:',
      items: [
        {
          label: '',
          text: 'Semi-finalist teams will have one week to develop a solution to a science or engineering problem and present their work through a recorded video.',
        },
      ],
    },
    {
      title: 'Final round: Live Zoom presentation',
      items: [
        {
          label: '',
          text: 'Finalist teams will have two weeks to come up with solution(s) to a science or engineering problem and present their solution to a judging panel.',
        },
      ],
    },
  ],
  ctaText: 'Register Now!',
  ctaLink: '/register',
  secondaryCtaText: 'Join the league',
  secondaryCtaLink: '/league',
  primaryColor: '#13294C',
}

/* ── Render ──────────────────────────────────────────────── */

export function CompetitionStructureRender({
  heading,
  heroImage,
  heroOverlayColor,
  heroOverlayOpacity,
  infoCards,
  roundsIcon,
  roundsHeading,
  rounds,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  primaryColor,
}: CompetitionStructureProps) {
  const cards = infoCards ?? []
  const roundsList = rounds ?? []
  const color = safeHex(primaryColor)

  // Hero aspect ratio — drives both the image height (via CSS
  // aspect-ratio) and the cards' 50% overlap (via negative margin).
  // The trick: CSS margin-top % and aspect-ratio both resolve from
  // the same parent width, so calc(-50% * H/W) = exactly half the
  // hero's rendered height at any viewport. One ratio, two uses.
  const HERO_W = 1447
  const HERO_H = 456

  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-2.5 md:px-5 lg:px-0">
        {/* Heading — Figma 40px Bold #222 → 0.75× 30px. Gap to hero: 52→39px ≈ mb-10 (40px) */}
        <h2
          className="font-bold text-center mb-10"
          style={{ fontSize: '30px', lineHeight: '1.3', color: '#222' }}
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
        {/* Hero image — aspect 1447/456. Cards below overlap 50% of hero
            via negative margin. margin-top % is relative to parent width,
            same base as aspect-ratio — so calc(-50% * 456/1447) = exactly
            half the hero height at any viewport. Cards stay in flow.

            CRITICAL: bottom 50% of this image is covered by cards.
            Figma original was 54/46 — we simplified to 50/50. When
            cropping hero images, ALL important content (faces, text,
            key details) MUST be in the top 50%. Even 1px of misplaced
            content into the bottom half will be hidden by cards. */}
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
                backgroundColor: hexAlpha(heroOverlayColor, heroOverlayOpacity),
              }}
            />
          </div>
        )}

        {/* Info cards — overlap hero by 50% of hero height */}
        {/* Card: #F2F3F0, corners 14→10.5 ≈ rounded-xl, Shadow Large */}
        {/* Padding: L 44→33 ≈ px-8 (32px), T 29→22 ≈ pt-6 (24px) */}
        {cards.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10"
            style={{ marginTop: heroImage?.url ? `calc(-50% * ${HERO_H} / ${HERO_W})` : '0' }}
          >
            {cards.map((card, i) => (
              <div
                key={`card-${card.heading}-${i}`}
                className="rounded-xl px-8 pt-6 pb-6"
                style={{ backgroundColor: '#f2f3f0', boxShadow: CARD_SHADOW }}
              >
                {i === 0 && <Groups className="w-11 h-11 mb-3 text-[#909090]" />}
                {i === 1 && <Category className="w-11 h-11 mb-3 text-[#909090]" />}
                {/* Card heading — Figma 25px Bold #222 → 0.75× 18px = text-lg */}
                {/* Heading→content: 20→15px ≈ mb-4 (16px) */}
                <h3
                  className="font-bold mb-4 mt-0 text-lg"
                  style={{ lineHeight: '1.3', color: '#222' }}
                >
                  {card.heading}
                </h3>

                {/* Plain text body */}
                {card.body && (
                  <p className="m-0 text-[15px]" style={{ color: '#222' }}>
                    {card.body}
                  </p>
                )}

                {/* Structured items (categories) */}
                {/* Between items: Figma 48→36px = mb-9 (36px) */}
                {(card.items ?? []).map((item, j) => (
                  <div
                    key={`item-${item.name}-${j}`}
                    className={j < card.items.length - 1 ? 'mb-9' : ''}
                  >
                    {/* Item name — Figma 22px SemiBold primaryColor → 0.75× 16px = text-base */}
                    <div className="font-semibold text-base" style={{ lineHeight: '1.4', color }}>
                      {item.name}
                    </div>
                    {/* Item grades — Figma 18px Medium #222 → 0.75× 14px = text-sm */}
                    <p className="m-0 text-sm" style={{ color: '#222' }}>
                      {item.grades}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Rounds card — Figma #F2F3F0, no corners, Shadow Large */}
        {/* Gap from info cards: 28→21px ≈ mt-5 (20px) */}
        {/* Padding: L 33→25 ≈ px-6 (24px), T 29→22 ≈ pt-6 (24px), B 62→47 ≈ pb-12 (48px) */}
        <div
          className="mt-5 px-6 pt-6 pb-12"
          style={{ backgroundColor: '#f2f3f0', boxShadow: CARD_SHADOW }}
        >
          <Diversity2 className="w-11 h-11 mb-3 text-[#909090]" />
          {/* Rounds heading — Figma 25px Bold #222 → 0.75× 18px = text-lg */}
          {/* Heading→round1: 34→26px ≈ mb-7 (28px) */}
          <h3 className="font-bold mb-7 mt-0 text-lg" style={{ lineHeight: '1.3', color: '#222' }}>
            {roundsHeading}
          </h3>

          {roundsList.map((round, i) => (
            <div key={`round-${round.title}-${i}`}>
              {/* Divider — Figma 1px #222, spacing 34→26px each side ≈ my-6 (24px) */}
              {i > 0 && <hr className="my-6 border-0 border-t" style={{ borderColor: '#222' }} />}
              {/* Round title with concentric circle bullet */}
              {/* Figma: 20×20 outer #4E88C7 (primary lightened) + 10×10 inner (primary solid) */}
              {/* 0.75×: 15×15 outer, 8×8 inner. Gap to text: 32→24px ≈ gap-3 (12px) */}
              {/* Title: 22px Bold primaryColor → 0.75× 16px = text-base */}
              <div className="flex items-start gap-3">
                <span
                  className="shrink-0 mt-1 rounded-full flex items-center justify-center"
                  style={{
                    width: '15px',
                    height: '15px',
                    backgroundColor: hexAlpha(primaryColor, 0.2),
                  }}
                >
                  <span
                    className="rounded-full"
                    style={{ width: '8px', height: '8px', backgroundColor: color }}
                  />
                </span>
                <div className="font-bold mb-2 text-base" style={{ lineHeight: '1.5', color }}>
                  {round.title}
                </div>
              </div>
              {/* Round items — Figma 22px Regular/SemiBold #222 → 0.75× 16px = text-base */}
              {(round.items ?? []).map((item, j) => (
                <p
                  key={`detail-${item.label}-${j}`}
                  className="mt-1 mb-2 text-base"
                  style={{ color: '#222' }}
                >
                  {item.label && <span className="font-semibold">{item.label} </span>}
                  {item.text}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* CTA buttons — Figma gap 38→29px ≈ gap-7 (28px), mt 52→39px ≈ mt-10 (40px) */}
        {/* Btn1: primaryColor bg, white text, 8→6px corners ≈ rounded-md */}
        {/* Btn2: transparent bg, primaryColor text+border (outline) */}
        {(ctaText || secondaryCtaText) && (
          <div className="flex flex-wrap justify-center gap-7 mt-10">
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
    </section>
  )
}
