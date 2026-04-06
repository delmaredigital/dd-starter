/**
 * AboutPartner — render function and types.
 * Server-safe: no client-only imports.
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
        <div className="flex flex-col items-start md:items-center mb-[34px]">
          <h2
            className="font-poppins font-semibold text-white text-left md:text-right m-0"
            style={{ fontSize: '26px', lineHeight: '35px' }}
          >
            {heading}
          </h2>
          <p
            className="text-white mb-0 whitespace-pre-line"
            style={{ fontSize: '16px' }}
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
        />
      </div>
    </section>
  )
}
