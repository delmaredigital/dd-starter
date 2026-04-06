/**
 * BenefitsGrid — 3-column grid with icon, colored heading, and description for each benefit.
 *
 * Used for: "Why Join the Competition?" sections.
 *
 * Reference: docs/reference/webflow/mit-ewb.html section.section-72
 * Source CSS: .section-72, .quick-stack-38, .cell-78, .text-block-140, .paragraph-57
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField, type MediaReference } from '@delmaredigital/payload-puck/fields'
import { AccentBar, CompetitionCTA, safeHex } from './shared'

export interface BenefitItem {
  icon: MediaReference | null
  heading: string
  description: string
}

export interface BenefitsGridProps {
  sectionHeading: string
  benefits: BenefitItem[]
  ctaText: string
  ctaLink: string
  primaryColor: string
  accentBarImage: MediaReference | null
}

const defaultProps: BenefitsGridProps = {
  sectionHeading: 'Why Join the Competition?',
  benefits: [
    { icon: null, heading: 'Benefit One', description: 'Description of the first benefit.' },
    { icon: null, heading: 'Benefit Two', description: 'Description of the second benefit.' },
    { icon: null, heading: 'Benefit Three', description: 'Description of the third benefit.' },
  ],
  ctaText: 'Competition Portal',
  ctaLink: '/portal',
  primaryColor: '#a31f35',
  accentBarImage: null,
}

function BenefitsGridRender({
  sectionHeading,
  benefits,
  ctaText,
  ctaLink,
  primaryColor,
  accentBarImage,
}: BenefitsGridProps) {
  const color = safeHex(primaryColor)

  return (
    <section className="py-10">
      <div className="max-w-[940px] mx-auto px-4 md:px-0 flex flex-col items-center">
        {/* Section heading + accent bar */}
        <div className="flex flex-col items-start w-full">
          <h2 className="text-[22px] font-bold leading-[30px] mb-0 font-poppins text-[#333]">
            {sectionHeading}
          </h2>
          <AccentBar image={accentBarImage} primaryColor={color} />
        </div>

        {/* Benefits grid — 3 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-10 mb-10 w-full">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex flex-col items-start">
              {benefit.icon?.url && (
                <img src={benefit.icon.url} alt={benefit.icon.alt || ''} className="w-[123px] h-[123px] mb-4" />
              )}
              <div
                className="text-lg font-semibold leading-[25px] mb-5 font-poppins"
                style={{ color }}
              >
                {benefit.heading}
              </div>
              <p className="text-[15px] leading-[22px] m-0 text-[#333]">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <CompetitionCTA text={ctaText} href={ctaLink} bgColor={color} textColor="#ffffff" />
      </div>
    </section>
  )
}

export const BenefitsGridConfig: ComponentConfig<BenefitsGridProps> = {
  label: 'Benefits Grid',
  fields: {
    sectionHeading: { type: 'text', label: 'Section Heading' },
    benefits: {
      type: 'array',
      label: 'Benefits',
      arrayFields: {
        icon: createMediaField({ label: 'Icon' }),
        heading: { type: 'text', label: 'Heading' },
        description: { type: 'textarea', label: 'Description' },
      },
    },
    ctaText: { type: 'text', label: 'CTA Button Text (leave empty to hide)' },
    ctaLink: { type: 'text', label: 'CTA Button Link' },
    primaryColor: { type: 'text', label: 'Brand Color (hex)' },
    accentBarImage: createMediaField({ label: 'Accent Bar Image (optional — falls back to colored bar)' }),
  },
  defaultProps,
  render: BenefitsGridRender,
}
