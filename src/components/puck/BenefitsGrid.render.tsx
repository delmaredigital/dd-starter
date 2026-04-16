/**
 * BenefitsGrid — render function and types.
 * Server-safe: no client-only imports.
 */
import { CompetitionCTA, BRAND_DARK, CTA_BG, CTA_TEXT } from './shared'

export const benefitIconMap: Record<string, { src: string; label: string }> = {
  'hs-profile': { src: '/competition-assets/benefit-hs-profile.svg', label: 'Build your profile' },
  'hs-experience': { src: '/competition-assets/benefit-hs-experience.svg', label: 'Gain real-world experience' },
  'hs-collaborate': { src: '/competition-assets/benefit-hs-collaborate.svg', label: 'Compete and Collaborate' },
  'jr-confidence': { src: '/competition-assets/benefit-jr-confidence.svg', label: 'Build STEM confidence' },
  'jr-learning': { src: '/competition-assets/benefit-jr-learning.svg', label: 'Reinforce math & science learning' },
  'jr-awareness': { src: '/competition-assets/benefit-jr-awareness.svg', label: 'Develop global awareness' },
}

export const benefitIconOptions = Object.entries(benefitIconMap).map(([value, { label }]) => ({ label, value }))

export interface BenefitItem {
  iconKey: string
  heading: string
  description: string
}

export interface BenefitsGridProps {
  sectionHeading: string
  benefits: BenefitItem[]
  ctaText: string
  ctaLink: string
}

export const defaultProps: BenefitsGridProps = {
  sectionHeading: 'Why Join {{Competition Name}} Competition?',
  benefits: [
    { iconKey: 'hs-profile', heading: 'Build your profile', description: 'Build a strong academic profile for university and internships' },
    { iconKey: 'hs-experience', heading: 'Gain real-world experience', description: 'Work on challenges inspired by real global problems' },
    { iconKey: 'hs-collaborate', heading: 'Compete and Collaborate', description: 'Work alongside peers who are as driven and ambitious' },
  ],
  ctaText: 'Competition Portal',
  ctaLink: '/portal',
}

export function BenefitsGridRender({
  sectionHeading, benefits, ctaText, ctaLink,
}: BenefitsGridProps) {
  const color = BRAND_DARK

  return (
    <section className="py-5 md:py-10">
      <div className="max-w-5xl mx-auto px-3 md:px-5 lg:px-0 flex flex-col items-center">
        <div className="flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-5 md:mb-10 text-[#222]">{sectionHeading}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-5 md:mb-10 w-full">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex flex-col items-start">
              {benefit.iconKey && benefitIconMap[benefit.iconKey] && (
                <img src={benefitIconMap[benefit.iconKey].src} alt={benefit.heading} className="w-[123px] h-[123px]" />
              )}
              <div className="text-lg font-semibold leading-tight mt-5 mb-1.5" style={{ color }}>{benefit.heading}</div>
              <p className="text-base m-0 text-[#818181]">{benefit.description}</p>
            </div>
          ))}
        </div>
        <CompetitionCTA text={ctaText} href={ctaLink} bgColor={CTA_BG} textColor={CTA_TEXT} />
      </div>
    </section>
  )
}
