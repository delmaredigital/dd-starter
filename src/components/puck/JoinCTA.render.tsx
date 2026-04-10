/**
 * JoinCTA — render function and types.
 * Server-safe: no client-only imports.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, safeHex } from './shared'

export interface JoinCTAProps {
  heading: string
  body: string
  ctaText: string
  ctaLink: string
  decorativeImage: MediaReference | null
  primaryColor: string
}

export const defaultProps: JoinCTAProps = {
  heading: 'Join the Challenge',
  body: "This competition is more than a contest; it's a gateway to the world of engineering innovation.\n\nRegister now to begin your journey into the exciting field of engineering, where you'll apply creative problem-solving and technical skills to real-world challenges.",
  ctaText: 'Competition Portal',
  ctaLink: '/portal',
  decorativeImage: null,
  primaryColor: '#a31f35',
}

export function JoinCTARender({
  heading, body, ctaText, ctaLink, decorativeImage, primaryColor,
}: JoinCTAProps) {
  const color = safeHex(primaryColor)

  return (
    <section style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="max-w-[940px] mx-auto px-2.5 md:px-5 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '35px' }}>
          {/* Left column: decorative image */}
          <div className="flex justify-center items-center">
            {decorativeImage?.url && (
              <img src={decorativeImage.url} alt={decorativeImage.alt || ''} className="max-w-full h-auto" />
            )}
          </div>

          {/* Right column: heading + body + CTA */}
          <div className="flex flex-col justify-center items-start">
            <h2
              className="font-bold mt-0 mb-4 text-3xl leading-[1.3]"
            >
              {heading}
            </h2>
            <p
              className="whitespace-pre-line mb-6"
            >
              {body}
            </p>
            <CompetitionCTA text={ctaText} href={ctaLink} bgColor={color} textColor="#ffffff" />
          </div>
        </div>
      </div>
    </section>
  )
}
