/**
 * TwoColumnFeature — render function and types.
 * Server-safe: no client-only imports.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { AccentBar, CompetitionCTA, safeHex } from './shared'

export interface TwoColumnFeatureProps {
  heading: string
  body: string
  ctaText: string
  ctaLink: string
  featureImage: MediaReference | null
  layout: 'image-right' | 'image-left'
  primaryColor: string
}

export const defaultProps: TwoColumnFeatureProps = {
  heading: 'Section Heading',
  body: 'Section body text goes here.',
  ctaText: 'Competition Portal',
  ctaLink: '/portal',
  featureImage: null,
  layout: 'image-right',
  primaryColor: '#a31f35',
}

export function TwoColumnFeatureRender({
  heading, body, ctaText, ctaLink, featureImage, layout, primaryColor,
}: TwoColumnFeatureProps) {
  const color = safeHex(primaryColor)
  const isImageRight = layout === 'image-right'

  const textColumn = (
    <div className="flex flex-col justify-center items-start">
      <h2 className="text-[22px] font-bold leading-[30px] mb-0 text-[#333]">{heading}</h2>
      <AccentBar primaryColor={color} />
      <p className="text-sm leading-5 mb-10 text-[#333] whitespace-pre-line">{body}</p>
      <CompetitionCTA text={ctaText} href={ctaLink} bgColor={color} textColor="#ffffff" />
    </div>
  )

  const imageColumn = (
    <div className="flex justify-center items-center">
      {featureImage?.url && <img src={featureImage.url} alt={featureImage.alt || ''} className="max-w-full h-auto" />}
    </div>
  )

  return (
    <section className="py-10">
      <div className="max-w-[940px] mx-auto px-5 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {isImageRight ? <>{textColumn}{imageColumn}</> : <>{imageColumn}{textColumn}</>}
        </div>
      </div>
    </section>
  )
}
