/**
 * AlgoEdFooter — render function and types.
 * Server-safe: no client-only imports.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, safeHex } from './shared'

export interface AlgoEdFooterProps {
  heading: string
  description: string
  ctaText: string
  ctaLink: string
  primaryColor: string
  logo: MediaReference | null
  backgroundImage: MediaReference | null
}

export const defaultProps: AlgoEdFooterProps = {
  heading: 'About',
  description: 'AlgoEd is a platform that hosts curated, prestigious competitions for middle and high school students.',
  ctaText: 'EXPLORE COMPETITIONS',
  ctaLink: 'https://app.algoed.co/explore-competitions',
  primaryColor: '#a90733',
  logo: null,
  backgroundImage: null,
}

export function AlgoEdFooterRender({
  heading, description, ctaText, ctaLink, primaryColor, logo, backgroundImage,
}: AlgoEdFooterProps) {
  const color = safeHex(primaryColor)
  const bgUrl = backgroundImage?.url || ''

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 0 }}>
        {/* Left: About + Logo */}
        <div
          className="flex flex-col justify-center items-center py-[15px] md:py-[30px] px-[10px]"
          style={{
            backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
            backgroundPosition: '0 0',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <div
            className="font-poppins text-white font-semibold"
            style={{ fontSize: '35px', lineHeight: '45px' }}
          >
            {heading}
          </div>
          {logo?.url && (
            <img src={logo.url} alt="" style={{ width: '150px' }} />
          )}
        </div>

        {/* Right: Description + CTA */}
        <div className="flex justify-center items-center p-[30px] md:py-[50px] md:px-[65px]">
          <div>
            <p
              className="font-poppins font-semibold"
              style={{ color: '#004785', fontSize: '20px', lineHeight: '28px' }}
            >
              {description}
            </p>
            <div className="mt-[7px]">
              <CompetitionCTA
                text={ctaText}
                href={ctaLink}
                bgColor="#ffffff"
                textColor={color}
                padding="5px 25px"
                target="_blank"
                border={`1px solid ${color}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
