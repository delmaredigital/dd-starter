/**
 * AboutPartner — render function and types.
 * Server-safe: no client-only imports.
 *
 * Source CSS: .section-70, .heading-114, .paragraph-55, .button-19
 * Note: source has 2 decorative divider images (image-164, image-148) between heading
 * and body. image-164 is display:none on desktop. Both are tiny white lines (~175 bytes)
 * on the burgundy background. Omitted — negligible visual impact.
 */
import { CompetitionCTA, BRAND_DARK } from './shared'

export interface AboutPartnerProps {
  heading: string
  body: string
  ctaText: string
  ctaLink: string
}

export const defaultProps: AboutPartnerProps = {
  heading: 'About MIT Engineers Without Borders',
  body: 'Engineers Without Borders is a non-profit that partners with people from countries around the globe, and works with them to find solutions that will improve quality of life in their communities.',
  ctaText: 'Learn More',
  ctaLink: '#',
}

export function AboutPartnerRender({
  heading, body, ctaText, ctaLink,
}: AboutPartnerProps) {
  const color = BRAND_DARK

  return (
    <section className="overflow-hidden" style={{ backgroundColor: color, paddingTop: '45px', paddingBottom: '45px' }}>
      <div className="max-w-6xl mx-auto px-5 lg:px-0 flex flex-col items-stretch lg:items-center">
        {/* Source .div-block-206: flex row on desktop (heading | divider | body), column on mobile */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-center mb-6">
          <h2
            className="font-semibold text-white text-left lg:text-right m-0 text-2xl md:text-3xl leading-tight"
          >
            {heading}
          </h2>
          {/* Decorative dividers — source image-164 (383x5, horizontal, mobile only) + image-148 (5x175, vertical, desktop only) */}
          <div className="block lg:hidden w-[383px] max-w-full h-[5px] my-4 rounded" style={{ backgroundColor: '#fff' }} />
          {/* Vertical divider — self-stretch to match sibling height dynamically */}
          <div className="hidden lg:block rounded self-stretch" style={{ width: '5px', backgroundColor: '#fff', marginLeft: '25px', marginRight: '25px', flexShrink: 0 }} />
          <p
            className="text-white mb-0 whitespace-pre-line text-base"
          >
            {body}
          </p>
        </div>
        <CompetitionCTA
          text={ctaText}
          href={ctaLink}
          bgColor="#ffffff"
          textColor={color}
          target="_blank"
        />
      </div>
    </section>
  )
}
