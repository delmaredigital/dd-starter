/**
 * CompetitionHero — render function and types.
 * Server-safe: no client-only imports (no createMediaField).
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, safeHex } from './shared'

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
  statusIcon: MediaReference | null
  ctaText: string
  ctaLink: string
  heroImage: MediaReference | null
  backgroundImage: MediaReference | null
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
  statusIcon: null,
  ctaText: 'Competition Portal',
  ctaLink: '/portal',
  heroImage: null,
  backgroundImage: null,
  badgeStripHeading: '',
  badgeStripItems: [],
}

export function CompetitionHeroRender({
  titleLine1, titleLine2, titleLine3, audienceLabel,
  primaryColor, highlightTextColor, statusText, statusIcon,
  ctaText, ctaLink, heroImage, backgroundImage,
  badgeStripHeading, badgeStripItems,
}: CompetitionHeroProps) {
  const color = safeHex(primaryColor)
  const bgImageUrl = backgroundImage?.url || ''
  const hasBadgeStrip = badgeStripItems && badgeStripItems.length > 0

  return (
    <section
      className="bg-cover bg-center"
      style={{
        backgroundColor: color,
        backgroundImage: bgImageUrl
          ? `linear-gradient(${color}f2, ${color}f2), url(${bgImageUrl})`
          : undefined,
        backgroundPosition: '0 0, 50%',
        backgroundSize: 'auto, cover',
        paddingTop: '2.5rem',
        paddingBottom: hasBadgeStrip ? '0' : '2.5rem',
      }}
    >
      <div className="max-w-[940px] mx-auto px-5 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-5">
          <div className="flex flex-col justify-center items-start">
            <h1 className="m-0">
              <span className="block text-white font-bold text-[28px] leading-[35px] sm:text-[45px] sm:leading-[55px]">{titleLine1}</span>
              {titleLine2 && (
                <span className="bg-white inline-block my-5 px-2.5 py-[5px]">
                  <span className="block font-bold text-[28px] leading-[35px] sm:text-[42px] sm:leading-[45px]" style={{ color: safeHex(highlightTextColor) }}>{titleLine2}</span>
                </span>
              )}
              <span className="block text-white font-bold text-[25px] leading-[33px] sm:text-[38px] sm:leading-[40px]">{titleLine3}</span>
            </h1>
            <p className="text-white font-bold mb-0 mt-4 sm:mt-5 text-[18px] leading-[25px] sm:text-2xl sm:leading-[30px]">{audienceLabel}</p>
            {statusText && (
              <div className="flex items-center my-6">
                {statusIcon?.url && <img src={statusIcon.url} alt="" className="mr-2.5 w-[54px] h-[54px]" />}
                <span className="text-white font-bold text-base leading-[22px] sm:text-lg sm:leading-6">{statusText}</span>
              </div>
            )}
            <CompetitionCTA text={ctaText} href={ctaLink} bgColor="#ffffff" textColor={color} />
          </div>
          <div className="flex justify-center items-center">
            {heroImage?.url && <img src={heroImage.url} alt={heroImage.alt || ''} className="max-w-full h-auto" />}
          </div>
        </div>
      </div>
      {hasBadgeStrip && (
        <div className="max-w-[940px] mx-auto px-5 lg:px-0 relative z-10 top-[75px]">
          <div
            className="rounded-2xl bg-white flex flex-col sm:flex-row justify-around items-center px-5 py-5 shadow-lg"
          >
            {badgeStripHeading && (
              <p className="text-center text-[20px] font-medium leading-[26px] mb-6 text-[#222]">
                {badgeStripHeading}
              </p>
            )}
            <div className="flex flex-col sm:flex-row flex-wrap justify-evenly items-center gap-6 sm:gap-8">
              {badgeStripItems.map((badge, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="flex-shrink-0 flex items-center justify-center w-[44px] h-[44px] sm:w-[53px] sm:h-[53px] rounded-full"
                    style={{ border: `2px solid ${color}` }}
                  >
                    {badge.icon?.url && (
                      <img src={badge.icon.url} alt={badge.icon.alt || badge.label}
                        className="w-[22px] h-[22px] sm:w-[28px] sm:h-[28px] object-contain" />
                    )}
                  </div>
                  <span className="text-[18px] sm:text-[24px] font-semibold uppercase leading-[24px] sm:leading-[31px]"
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
