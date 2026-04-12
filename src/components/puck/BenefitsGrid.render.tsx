/**
 * BenefitsGrid — render function and types.
 * Server-safe: no client-only imports.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, safeHex } from './shared'

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
      <div className="max-w-5xl mx-auto px-5 lg:px-0 flex flex-col items-center">
        <div className="flex flex-col items-start">
          <h2 className="text-3xl font-bold leading-[1.3] mb-0 text-[#333]">{sectionHeading}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-10 mt-10 mb-10 w-full">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex flex-col items-start">
              {benefit.icon?.url && (
                <img src={benefit.icon.url} alt={benefit.icon.alt || ''} className="w-[123px] h-[123px]" />
              )}
              <div className="text-lg font-semibold leading-[1.3] mt-5 mb-1.5" style={{ color }}>{benefit.heading}</div>
              <p className="text-[15px] m-0 text-[#808080]">{benefit.description}</p>
            </div>
          ))}
        </div>
        <CompetitionCTA text={ctaText} href={ctaLink} bgColor={color} textColor="#ffffff" />
      </div>
    </section>
  )
}
