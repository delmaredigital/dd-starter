/**
 * CompetitionHero — render function and types.
 * Server-safe: no client-only imports (no createMediaField).
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import {
  CompetitionCTA,
  BRAND_DARK,
  HERO_OVERLAY,
  HERO_TEXT,
  HIGHLIGHT_BG,
  HIGHLIGHT_TEXT,
  HERO_CTA_BG,
  HERO_CTA_TEXT,
  HERO_CTA2_COLOR,
} from './shared'
import { CalendarToday, iconMap, School } from './icons'

export interface BadgeItem {
  label: string
  iconName: string
}

export interface CompetitionHeroProps {
  titleLine1: string
  titleLine2: string
  titleLine3: string
  audienceLabel: string
  statusText: string
  statusSubtext: string
  ctaText: string
  ctaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  heroImage: MediaReference | null
  backgroundImage: MediaReference | null
  overlayTopOpacity: number
  overlayBottomOpacity: number
  badgeStripHeading: string
  badgeStripItems: BadgeItem[]
}

export const defaultProps: CompetitionHeroProps = {
  titleLine1: 'COMPETITION',
  titleLine2: 'NAME HERE',
  titleLine3: 'COMPETITION 2026',
  audienceLabel: 'For Middle and High School Students',
  statusText: 'Registration Open',
  statusSubtext: '',
  ctaText: 'Competition Portal',
  ctaLink: '/portal',
  secondaryCtaText: '',
  secondaryCtaLink: '',
  heroImage: null,
  backgroundImage: null,
  overlayTopOpacity: 80,
  overlayBottomOpacity: 100,
  badgeStripHeading: '',
  badgeStripItems: [],
}

export function CompetitionHeroRender({
  titleLine1,
  titleLine2,
  titleLine3,
  audienceLabel,
  statusText,
  statusSubtext,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  heroImage,
  backgroundImage,
  overlayTopOpacity,
  overlayBottomOpacity,
  badgeStripHeading,
  badgeStripItems,
}: CompetitionHeroProps) {
  const color = BRAND_DARK
  const bgImageUrl = backgroundImage?.url || ''
  const hasBadgeStrip = badgeStripItems && badgeStripItems.length > 0

  const topPct = overlayTopOpacity ?? 80
  const bottomPct = overlayBottomOpacity ?? 100
  const overlayLayer = `linear-gradient(color-mix(in srgb, ${HERO_OVERLAY} ${topPct}%, transparent), color-mix(in srgb, ${HERO_OVERLAY} ${bottomPct}%, transparent))`

  return (
    <section>
      <div
        className="bg-cover bg-center"
        style={{
          backgroundColor: HERO_OVERLAY,
          backgroundImage: bgImageUrl ? `${overlayLayer}, url("${bgImageUrl}")` : undefined,
          backgroundPosition: '0 0, 50%',
          backgroundSize: 'auto, cover',
          paddingTop: '2.5rem',
          paddingBottom: hasBadgeStrip ? '6rem' : '2.5rem',
        }}
      >
        <div className="relative overflow-hidden px-3 md:px-5">
          {/* Content-first ordering: text + CTA in DOM before the illustration.
           Mobile: title, CTA, etc. render first, illustration below.
           Desktop: illustration gets lg:absolute and overlaps the right side
           of the text; DOM order is irrelevant for absolute-positioned
           elements. Fixes the mobile issue where a 400px decorative image
           pushed the title and CTA below the fold.
           Horizontal padding (px-5 on mobile) is on the parent so both the
           text column and the stacked illustration share the same 20px
           breathing room from the viewport edges. */}
          <div className="max-w-5xl mx-auto relative z-10">
            <h1 className="m-0">
              <span
                className="block font-bold uppercase text-3xl md:text-4xl lg:text-5xl leading-[1.3]"
                style={{ color: HERO_TEXT }}
              >
                {titleLine1}
              </span>
              {/* Highlight bar — Figma uses lineHeight 1.70 on the middle line
                  to inflate the line box as visual padding. Encoded directly via
                  `leading-[1.7]` on the inner text, no margin/padding tricks.
                  Lines 1+3 use 1.30 across all templates (login, OG, hero); only
                  the pill inflation differs. See typography contract in
                  `src/lib/competition-image/proportions.ts`. */}
              {titleLine2 && (
                <span
                  className="inline-block px-2.5 rounded-[10px]"
                  style={{ backgroundColor: HIGHLIGHT_BG }}
                >
                  <span
                    className="block font-bold uppercase text-3xl md:text-4xl lg:text-5xl leading-[1.7]"
                    style={{ color: HIGHLIGHT_TEXT }}
                  >
                    {titleLine2}
                  </span>
                </span>
              )}
              <span
                className="block font-bold uppercase text-3xl md:text-4xl lg:text-5xl leading-[1.3]"
                style={{ color: HERO_TEXT }}
              >
                {titleLine3}
              </span>
            </h1>
            <p
              className="font-baskervville italic underline mb-0 mt-4 md:mt-5 text-xl md:text-2xl leading-normal"
              style={{ color: HERO_TEXT }}
            >
              {audienceLabel}
            </p>
            {statusText && (
              <div className="flex items-center my-6">
                <div
                  className="mr-2.5 w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{ borderColor: `color-mix(in srgb, ${HERO_TEXT} 45%, transparent)` }}
                >
                  <CalendarToday className="w-5 h-5" style={{ color: HERO_TEXT }} />
                </div>
                <div>
                  <span
                    className="block font-semibold text-lg leading-tight"
                    style={{ color: HERO_TEXT }}
                  >
                    {statusText}
                  </span>
                  {statusSubtext && (
                    <span
                      className="block font-medium text-base leading-normal"
                      style={{ color: HERO_TEXT }}
                    >
                      {statusSubtext}
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-5 md:gap-6">
              <CompetitionCTA
                text={ctaText}
                href={ctaLink}
                bgColor={HERO_CTA_BG}
                textColor={HERO_CTA_TEXT}
              />
              <CompetitionCTA
                text={secondaryCtaText}
                href={secondaryCtaLink}
                bgColor="transparent"
                textColor={HERO_CTA2_COLOR}
                border={`1px solid ${HERO_CTA2_COLOR}`}
              />
            </div>
            {/* Compact callout: tighter than the hero's normal grouping rhythm so it
                reads as supporting CTA copy, not a separate content block. */}
            <div
              className="mt-4 md:mt-5 w-full md:w-[52%] border-l-4 px-4 py-4 md:px-5 md:py-5"
              style={{
                borderColor: HERO_CTA_BG,
                backgroundColor: `color-mix(in srgb, ${HERO_OVERLAY} 85%, black)`,
              }}
            >
              <p className="m-0 text-sm leading-relaxed" style={{ color: HERO_TEXT }}>
                <School className="mr-1.5 inline-block h-5 w-5 align-middle" />
                <strong className="font-bold">Teacher or school coordinator?</strong> Email{' '}
                <a
                  href="mailto:schools@algoed.co"
                  className="underline underline-offset-2"
                  style={{ color: HERO_CTA_BG }}
                >
                  schools@algoed.co
                </a>{' '}
                to create your School Dashboard. Manage, monitor &amp; analyze student
                communications, results and awards.
              </p>
            </div>
            {/* Illustration — responsive width. Desktop (md+): absolute, 45% of
             container (matches OG generator). Mobile: in flow, centered, w-96
             (384px) capped at container width. */}
            {heroImage?.url && (
              <img
                src={heroImage.url}
                alt={heroImage.alt || ''}
                className="md:absolute md:-z-10 block mx-auto md:mx-0 mt-6 md:mt-0 h-auto w-96 max-w-full md:w-[45%] md:max-h-[80%] md:object-contain"
                style={{
                  right: 0,
                  bottom: '2px',
                }}
              />
            )}
          </div>
        </div>
      </div>
      {hasBadgeStrip && (
        <div className="max-w-[960px] mx-auto px-3 md:px-5 relative z-10 -mt-16 mb-8">
          <div
            className="rounded-[15px] bg-white px-5 py-5"
            style={{ boxShadow: '0 -5px 50px rgba(62,63,65,0.08), 0 5px 50px rgba(62,63,65,0.08)' }}
          >
            {badgeStripHeading && (
              <p className="text-center text-base font-medium leading-tight mb-4 text-[#222]">
                {badgeStripHeading}
              </p>
            )}
            <div className="flex flex-col sm:flex-row flex-wrap justify-around items-center gap-6 sm:gap-8">
              {badgeStripItems.map((badge, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="flex-shrink-0 flex items-center justify-center w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] rounded-full"
                    style={{ border: `2px solid ${color}` }}
                  >
                    {iconMap[badge.iconName] &&
                      (() => {
                        const Icon = iconMap[badge.iconName]!
                        return <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
                      })()}
                  </div>
                  <span className="text-lg font-semibold uppercase leading-tight" style={{ color }}>
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
