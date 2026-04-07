/**
 * BenefitsGrid — render function and types.
 * Server-safe: no client-only imports.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
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
}

export const defaultProps: BenefitsGridProps = {
  sectionHeading: 'Why Join the Competition?',
  benefits: [
    { icon: null, heading: 'Benefit One', description: 'Description of the first benefit.' },
    { icon: null, heading: 'Benefit Two', description: 'Description of the second benefit.' },
    { icon: null, heading: 'Benefit Three', description: 'Description of the third benefit.' },
  ],
  ctaText: 'Competition Portal',
  ctaLink: '/portal',
  primaryColor: '#a31f35',
}

export function BenefitsGridRender({
  sectionHeading, benefits, ctaText, ctaLink, primaryColor,
}: BenefitsGridProps) {
  const color = safeHex(primaryColor)

  return (
    <section className="py-10">
      <div className="max-w-[940px] mx-auto px-4 md:px-0 flex flex-col items-center">
        <div className="flex flex-col items-start w-full">
          <h2 className="text-[22px] font-bold leading-[30px] mb-0 text-[#333]">{sectionHeading}</h2>
          <AccentBar primaryColor={color} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-10 mb-10 w-full">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex flex-col items-start">
              {benefit.icon?.url && (
                <img src={benefit.icon.url} alt={benefit.icon.alt || ''} className="w-[123px] h-[123px] mb-4" />
              )}
              <div className="text-lg font-semibold leading-[25px] mb-5" style={{ color }}>{benefit.heading}</div>
              <p className="text-[15px] leading-[22px] m-0 text-[#333]">{benefit.description}</p>
            </div>
          ))}
        </div>
        <CompetitionCTA text={ctaText} href={ctaLink} bgColor={color} textColor="#ffffff" />
      </div>
    </section>
  )
}
