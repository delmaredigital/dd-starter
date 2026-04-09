/**
 * CompetitionHero — render function and types.
 * Server-safe: no client-only imports (no createMediaField).
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, safeHex, hexAlpha } from './shared'

export interface BadgeItem {
  label: string
  icon: MediaReference | null
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
  statusIcon: MediaReference | null
  ctaText: string
  ctaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  heroImage: MediaReference | null
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
  statusIcon: null,
  ctaText: 'Competition Portal',
  ctaLink: '/portal',
  secondaryCtaText: '',
  secondaryCtaLink: '',
  heroImage: null,
  backgroundImage: null,
  overlayColor: '',
  overlayOpacity: 90,
  overlayCSS: '',
  badgeStripHeading: '',
  badgeStripItems: [],
}

export function CompetitionHeroRender({
  titleLine1, titleLine2, titleLine3, audienceLabel,
  primaryColor, highlightTextColor, statusText, statusSubtext, statusIcon,
  ctaText, ctaLink, secondaryCtaText, secondaryCtaLink,
  heroImage, backgroundImage,
  overlayColor, overlayOpacity, overlayCSS,
  badgeStripHeading, badgeStripItems,
}: CompetitionHeroProps) {
  const color = safeHex(primaryColor)
  const bgImageUrl = backgroundImage?.url || ''
  const hasBadgeStrip = badgeStripItems && badgeStripItems.length > 0

  const solid = hexAlpha(overlayColor || primaryColor, (overlayOpacity ?? 90) / 100)
  const overlayLayer = overlayCSS || `linear-gradient(${solid}, ${solid})`

  return (
    <section
      className="bg-cover bg-center overflow-hidden"
      style={{
        backgroundColor: color,
        backgroundImage: bgImageUrl
          ? `${overlayLayer}, url(${bgImageUrl})`
          : undefined,
        backgroundPosition: '0 0, 50%',
        backgroundSize: 'auto, cover',
        paddingTop: '2.5rem',
        paddingBottom: hasBadgeStrip ? '8rem' : '2.5rem',
      }}
    >
      <div className="relative max-w-[1280px] mx-auto px-5 lg:px-10">
        {/* Floating illustration — behind text on desktop, stacked on mobile */}
        {heroImage?.url && (
          <div className="lg:absolute lg:right-0 lg:bottom-12 lg:w-1/2 flex justify-center mb-6 lg:mb-0">
            <img src={heroImage.url} alt={heroImage.alt || ''} className="max-w-full h-auto object-contain" />
          </div>
        )}
        {/* Text content — full width, flows naturally */}
        <div className="relative z-10 lg:w-[60%]">
          <h1 className="m-0">
            <span className="block text-white font-bold uppercase text-[28px] leading-[1.3] sm:text-[45px] lg:text-[65px]">{titleLine1}</span>
            {titleLine2 && (
              <span className="bg-white inline-block my-4 px-3 py-1.5 rounded-[14px]">
                <span className="block font-bold uppercase text-[28px] leading-[1.7] sm:text-[42px] lg:text-[65px]" style={{ color: safeHex(highlightTextColor) }}>{titleLine2}</span>
              </span>
            )}
            <span className="block text-white font-bold uppercase text-[25px] leading-[1.3] sm:text-[38px] lg:text-[65px]">{titleLine3}</span>
          </h1>
          <p className="font-baskervville italic underline text-white mb-0 mt-4 sm:mt-5 text-[22px] leading-[30px] sm:text-[32px] sm:leading-[40px]">{audienceLabel}</p>
          {statusText && (
            <div className="flex items-center my-6">
              {statusIcon?.url && <img src={statusIcon.url} alt="" className="mr-3 w-[48px] h-[48px] sm:w-[63px] sm:h-[63px]" />}
              <div>
                <span className="block text-white font-semibold text-lg leading-6 sm:text-[24px] sm:leading-[31px]">{statusText}</span>
                {statusSubtext && <span className="block text-white font-medium text-base leading-5 sm:text-[22px] sm:leading-[29px]">{statusSubtext}</span>}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-4">
            <CompetitionCTA text={ctaText} href={ctaLink} bgColor="#ffffff" textColor={color} />
            <CompetitionCTA text={secondaryCtaText} href={secondaryCtaLink} bgColor="transparent" textColor="#ffffff" border="2px solid #ffffff" />
          </div>
        </div>
      </div>
      {hasBadgeStrip && (
        <div className="max-w-[1270px] mx-auto px-5 lg:px-0 relative z-10 -mt-24 mb-16">
          <div
            className="rounded-[18px] bg-white py-6 px-8"
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
                    {badge.icon?.url && (
                      <img src={badge.icon.url} alt={badge.icon.alt || badge.label}
                        className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
                    )}
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
