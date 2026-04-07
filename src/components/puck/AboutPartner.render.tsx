/**
 * AboutPartner — render function and types.
 * Server-safe: no client-only imports.
 *
 * Source CSS: .section-70, .heading-114, .paragraph-55, .button-19
 * Note: source has 2 decorative divider images (image-164, image-148) between heading
 * and body. image-164 is display:none on desktop. Both are tiny white lines (~175 bytes)
 * on the burgundy background. Omitted — negligible visual impact.
 */
import { CompetitionCTA, safeHex } from './shared'

export interface AboutPartnerProps {
  heading: string
  body: string
  ctaText: string
  ctaLink: string
  primaryColor: string
}

export const defaultProps: AboutPartnerProps = {
  heading: 'About MIT Engineers Without Borders',
  body: 'Engineers Without Borders is a non-profit that partners with people from countries around the globe, and works with them to find solutions that will improve quality of life in their communities.',
  ctaText: 'Learn More',
  ctaLink: '#',
  primaryColor: '#a31f35',
}

export function AboutPartnerRender({
  heading, body, ctaText, ctaLink, primaryColor,
}: AboutPartnerProps) {
  const color = safeHex(primaryColor)

  return (
    <section style={{ backgroundColor: color, paddingTop: '45px', paddingBottom: '45px' }}>
      <div className="max-w-[940px] mx-auto px-4 md:px-0 flex flex-col items-center">
        {/* Source .div-block-206: flex row on desktop (heading | divider | body), column on mobile */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-center mb-[34px]">
          <h2
            className="font-semibold text-white text-left md:text-right m-0 text-[24px] leading-[24px] md:text-[26px] md:leading-[35px]"
          >
            {heading}
          </h2>
          {/* Decorative dividers — source image-164 (383x5, horizontal, mobile only) + image-148 (5x175, vertical, desktop only) */}
          <div className="block md:hidden w-[383px] max-w-full h-[5px] my-2 rounded" style={{ backgroundColor: '#fff' }} />
          <div className="hidden md:block rounded" style={{ width: '5px', height: '175px', backgroundColor: '#fff', marginLeft: '25px', marginRight: '25px', flexShrink: 0 }} />
          <p
            className="text-white mb-0 whitespace-pre-line text-sm leading-[18px] md:text-base md:leading-normal"
          >
            {body}
          </p>
        </div>
        <CompetitionCTA
          text={ctaText}
          href={ctaLink}
          bgColor="#ffffff"
          textColor={color}
          padding="10px 25px"
          target="_blank"
          lineHeight="22px"
        />
      </div>
    </section>
  )
}
