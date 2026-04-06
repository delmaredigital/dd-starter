/**
 * CompetitionHero — full-width hero section for competition landing pages.
 *
 * Two-column grid: left has stacked title lines, status badge, and CTA;
 * right has a feature illustration. Background uses a branded color overlay
 * on top of an optional background image.
 *
 * Reference: docs/reference/webflow/mit-ewb.html section.section-69
 * Source CSS: .section-69, .heading-110 through .heading-113, .button-18.text-color
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField, type MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, safeHex } from './shared'

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
}

const defaultProps: CompetitionHeroProps = {
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
}

function CompetitionHeroRender({
  titleLine1,
  titleLine2,
  titleLine3,
  audienceLabel,
  primaryColor,
  highlightTextColor,
  statusText,
  statusIcon,
  ctaText,
  ctaLink,
  heroImage,
  backgroundImage,
}: CompetitionHeroProps) {
  const color = safeHex(primaryColor)
  const bgImageUrl = backgroundImage?.url || ''

  return (
    <section
      className="py-10 bg-cover bg-center"
      style={{
        backgroundColor: color,
        backgroundImage: bgImageUrl
          ? `linear-gradient(${color}f2, ${color}f2), url(${bgImageUrl})`
          : undefined,
        backgroundPosition: '0 0, 50%',
        backgroundSize: 'auto, cover',
      }}
    >
      <div className="max-w-[940px] mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left column */}
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-white font-bold m-0 font-poppins text-[45px] leading-[55px]">
              {titleLine1}
            </h1>

            {titleLine2 && (
              <div className="bg-white inline-block my-5 px-2.5 py-[5px]">
                <h1
                  className="font-bold m-0 font-poppins text-[42px] leading-[45px]"
                  style={{ color: safeHex(highlightTextColor) }}
                >
                  {titleLine2}
                </h1>
              </div>
            )}

            <h1 className="text-white font-bold m-0 font-poppins text-[38px] leading-[40px]">
              {titleLine3}
            </h1>

            <h2 className="text-white font-bold mb-0 mt-5 font-poppins text-2xl leading-[30px]">
              {audienceLabel}
            </h2>

            {statusText && (
              <div className="flex items-center my-6">
                {statusIcon?.url && (
                  <img src={statusIcon.url} alt="" className="mr-2.5 w-[54px] h-[54px]" />
                )}
                <span className="text-white text-lg font-semibold leading-6">
                  {statusText}
                </span>
              </div>
            )}

            <CompetitionCTA text={ctaText} href={ctaLink} bgColor="#ffffff" textColor={color} />
          </div>

          {/* Right column */}
          <div className="flex justify-center items-center">
            {heroImage?.url && (
              <img src={heroImage.url} alt={heroImage.alt || ''} className="max-w-full h-auto" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export const CompetitionHeroConfig: ComponentConfig<CompetitionHeroProps> = {
  label: 'Competition Hero',
  fields: {
    titleLine1: { type: 'text', label: 'Title Line 1 (e.g. "MIT EWB")' },
    titleLine2: { type: 'text', label: 'Title Line 2 — highlighted (e.g. "SCIENCE & ENGINEERING")' },
    titleLine3: { type: 'text', label: 'Title Line 3 (e.g. "COMPETITION 2026")' },
    audienceLabel: { type: 'text', label: 'Audience (e.g. "For Middle and High School Students")' },
    primaryColor: { type: 'text', label: 'Brand Color (hex, e.g. #a31f35)' },
    highlightTextColor: { type: 'text', label: 'Highlight Text Color (hex, e.g. #a31f35)' },
    statusText: { type: 'text', label: 'Status Text (e.g. "Registration Open")' },
    statusIcon: createMediaField({ label: 'Status Icon' }),
    ctaText: { type: 'text', label: 'CTA Button Text' },
    ctaLink: { type: 'text', label: 'CTA Button Link' },
    heroImage: createMediaField({ label: 'Hero Illustration (right column)' }),
    backgroundImage: createMediaField({ label: 'Background Image (behind overlay)' }),
  },
  defaultProps,
  render: CompetitionHeroRender,
}
