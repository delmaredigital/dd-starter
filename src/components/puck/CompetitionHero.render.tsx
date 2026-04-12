/**
 * CompetitionHero — render function and types.
 * Server-safe: no client-only imports (no createMediaField).
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, safeHex, hexAlpha } from './shared'
import { usePrimaryColor } from './CompetitionColors'
import { CalendarToday, iconMap } from './icons'

export interface BadgeItem {
  label: string
  iconName: string
}

export interface CompetitionHeroProps {
  titleLine1: string
  titleLine2: string
  titleLine3: string
  audienceLabel: string
  primaryColor: string
  highlightTextColor: string
  statusText: string
  statusSubtext: string
  ctaText: string
  ctaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  heroImage: MediaReference | null
  heroImageWidth: number
  heroImageRightOffset: number
  heroImageBottomGap: number
  backgroundImage: MediaReference | null
  overlayColor: string
  overlayOpacity: number
  overlayCSS: string
  badgeStripHeading: string
  badgeStripItems: BadgeItem[]
}

export const defaultProps: CompetitionHeroProps = {
  titleLine1: 'COMPETITION',
  titleLine2: 'NAME HERE',
  titleLine3: 'COMPETITION 2026',
  audienceLabel: 'For Middle and High School Students',
  primaryColor: '#a31f35',
  highlightTextColor: '#a31f35',
  statusText: 'Registration Open',
  statusSubtext: '',
  ctaText: 'Competition Portal',
  ctaLink: '/portal',
  secondaryCtaText: '',
  secondaryCtaLink: '',
  heroImage: null,
  heroImageWidth: 400,
  heroImageRightOffset: 45,
  heroImageBottomGap: 2,
  backgroundImage: null,
  overlayColor: '',
  overlayOpacity: 90,
  overlayCSS: '',
  badgeStripHeading: '',
  badgeStripItems: [],
}

export function CompetitionHeroRender({
  titleLine1, titleLine2, titleLine3, audienceLabel,
  primaryColor: propColor, highlightTextColor, statusText, statusSubtext,
  ctaText, ctaLink, secondaryCtaText, secondaryCtaLink,
  heroImage, heroImageWidth, heroImageRightOffset, heroImageBottomGap,
  backgroundImage,
  overlayColor, overlayOpacity, overlayCSS,
  badgeStripHeading, badgeStripItems,
}: CompetitionHeroProps) {
  const primaryColor = usePrimaryColor(propColor)
  const color = safeHex(primaryColor)
  const bgImageUrl = backgroundImage?.url || ''
  const hasBadgeStrip = badgeStripItems && badgeStripItems.length > 0

  const solid = hexAlpha(overlayColor || primaryColor, (overlayOpacity ?? 90) / 100)
  const overlayLayer = overlayCSS || `linear-gradient(${solid}, ${solid})`

  return (
    <section>
    <div
      className="bg-cover bg-center"
      style={{
        backgroundColor: color,
        backgroundImage: bgImageUrl
          ? `${overlayLayer}, url(${bgImageUrl})`
          : undefined,
        backgroundPosition: '0 0, 50%',
        backgroundSize: 'auto, cover',
        paddingTop: '2.5rem',
        paddingBottom: hasBadgeStrip ? '6rem' : '2.5rem',
      }}
    >
      <div className="relative overflow-hidden px-5 lg:px-0">
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
            <span className="block text-white font-bold uppercase text-3xl leading-[1.3] sm:text-5xl">{titleLine1}</span>
            {titleLine2 && (
              <span className="bg-white inline-block my-5 px-2.5 py-[5px]">
                <span className="block font-bold uppercase text-3xl leading-[1.7] sm:text-5xl" style={{ color: safeHex(highlightTextColor) }}>{titleLine2}</span>
              </span>
            )}
            <span className="block text-white font-bold uppercase text-3xl leading-[1.3] sm:text-5xl">{titleLine3}</span>
          </h1>
          <p className="font-baskervville italic underline text-white mb-0 mt-4 sm:mt-5 text-xl leading-[30px] sm:text-2xl sm:leading-[36px]">{audienceLabel}</p>
          {statusText && (
            <div className="flex items-center my-6">
              <div className="mr-2.5 w-12 h-12 rounded-full border-2 border-white/45 flex items-center justify-center shrink-0">
                <CalendarToday className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block text-white font-semibold text-lg leading-7">{statusText}</span>
                {statusSubtext && <span className="block text-white font-medium text-[15px] leading-6">{statusSubtext}</span>}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-4">
            <CompetitionCTA text={ctaText} href={ctaLink} bgColor="#ffffff" textColor={color} />
            <CompetitionCTA text={secondaryCtaText} href={secondaryCtaLink} bgColor="transparent" textColor="#ffffff" border="1px solid #ffffff" />
          </div>
        </div>
        {/* Floating illustration — on desktop absolutely positioned to
           overlap the right side of the text; on mobile in normal flow
           below the text, centered via `block mx-auto`. Horizontal
           padding is inherited from the parent (see above), so the img
           just needs `max-w-full` to not exceed the parent's content
           area (which is already viewport − 40px on mobile). */}
        {heroImage?.url && (
          <img
            src={heroImage.url}
            alt={heroImage.alt || ''}
            className="lg:absolute block mx-auto lg:mx-0 mt-6 lg:mt-0 max-w-full h-auto"
            style={{
              left: `calc(50% + ${470 - (heroImageWidth ?? 400) + (heroImageRightOffset ?? 45)}px)`,
              bottom: `${heroImageBottomGap ?? 8}px`,
              width: `${heroImageWidth ?? 400}px`,
            }}
          />
        )}
      </div>
    </div>
      {hasBadgeStrip && (
        <div className="max-w-[960px] mx-auto px-5 lg:px-0 relative z-10 -mt-16 mb-8">
          <div
            className="rounded-[15px] bg-white px-5 py-5"
            style={{ boxShadow: '0 -5px 50px rgba(62,63,65,0.08), 0 5px 50px rgba(62,63,65,0.08)' }}
          >
            {badgeStripHeading && (
              <p className="text-center text-base font-medium leading-[1.3] mb-4 text-[#222]">
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
                    {iconMap[badge.iconName] && (() => {
                      const Icon = iconMap[badge.iconName]!
                      return <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
                    })()}
                  </div>
                  <span className="text-[14px] sm:text-[18px] font-semibold uppercase leading-[1.3]"
                    style={{ color }}>
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
