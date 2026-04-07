/**
 * AlgoEdFooter — render function and types.
 * Server-safe: no client-only imports.
 *
 * Text content (heading, description, CTA) is identical across all competitions — hardcoded.
 * Only primaryColor, logo, and backgroundImage vary per competition.
 * Source CSS: .cell-21, .text-block-80, .image-84, .cell-22, .paragraph-35, .button-11
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, safeHex } from './shared'

export interface AlgoEdFooterProps {
  primaryColor: string
  logo: MediaReference | null
  backgroundImage: MediaReference | null
}

export const defaultProps: AlgoEdFooterProps = {
  primaryColor: '#a90733',
  logo: null,
  backgroundImage: null,
}

export function AlgoEdFooterRender({
  primaryColor, logo, backgroundImage,
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
            style={{ fontSize: '40px', lineHeight: '65px' }}
          >
            About
          </div>
          {logo?.url && (
            <img src={logo.url} alt="" style={{ width: '200px' }} />
          )}
        </div>

        {/* Right: Description + CTA */}
        <div className="flex justify-center items-center p-[30px] md:py-[50px] md:px-[65px]">
          <div>
            <p
              className="font-poppins font-semibold"
              style={{ color: '#004785', fontSize: '20px', lineHeight: '28px' }}
            >
              AlgoEd is a platform that hosts curated, prestigious competitions for middle and high school students.
            </p>
            <div className="mt-[7px]">
              <CompetitionCTA
                text="EXPLORE COMPETITIONS"
                href="https://app.algoed.co/explore-competitions"
                bgColor="#ffffff"
                textColor={color}
                padding="5px 52px"
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
