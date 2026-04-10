/**
 * TwoColumnFeature — render function and types.
 * Server-safe: no client-only imports.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, RichText, safeHex } from './shared'

export interface TwoColumnFeatureProps {
  heading: string
  body: string
  ctaText: string
  ctaLink: string
  ctaVariant: 'filled' | 'outline'
  secondaryCtaText: string
  secondaryCtaLink: string
  featureImage: MediaReference | null
  imageStyle: 'plain' | 'card'
  layout: 'image-right' | 'image-left'
  bgColor: string
  primaryColor: string
}

export const defaultProps: TwoColumnFeatureProps = {
  heading: 'Section Heading',
  body: 'Section body text goes here.',
  ctaText: 'Competition Portal',
  ctaLink: '/portal',
  ctaVariant: 'filled',
  secondaryCtaText: '',
  secondaryCtaLink: '',
  featureImage: null,
  imageStyle: 'plain',
  layout: 'image-right',
  bgColor: '',
  primaryColor: '#a31f35',
}

export function TwoColumnFeatureRender({
  heading, body, ctaText, ctaLink, ctaVariant, secondaryCtaText, secondaryCtaLink,
  featureImage, imageStyle, layout, bgColor, primaryColor,
}: TwoColumnFeatureProps) {
  const color = safeHex(primaryColor)
  const isImageRight = layout === 'image-right'

  const textColumn = (
    <div className="flex flex-col justify-center items-start">
      <h2 className="text-3xl font-bold leading-[1.3] mb-6 text-[#333]">{heading}</h2>
      <RichText html={body} className="text-[15px] mb-6 text-[#333]" />
      <div className="flex flex-wrap gap-4">
        {ctaVariant === 'outline'
          ? <CompetitionCTA text={ctaText} href={ctaLink} bgColor="transparent" textColor={color} border={`1px solid ${color}`} />
          : <CompetitionCTA text={ctaText} href={ctaLink} bgColor={color} textColor="#ffffff" />
        }
        <CompetitionCTA text={secondaryCtaText} href={secondaryCtaLink} bgColor="transparent" textColor={color} border={`1px solid ${color}`} />
      </div>
    </div>
  )

  const isCard = imageStyle === 'card'
  const imageColumn = (
    <div className="flex justify-center items-center">
      {featureImage?.url && (
        <div className={isCard ? 'border-[10px] border-white rounded-[14px] shadow-[0_1px_17px_rgba(0,0,0,0.17)] overflow-hidden' : ''}>
          <img src={featureImage.url} alt={featureImage.alt || ''} className={`max-w-full h-auto ${isCard ? 'rounded-[4px]' : ''}`} />
        </div>
      )}
    </div>
  )

  return (
    <section className="py-10" style={bgColor ? { backgroundColor: bgColor } : undefined}>
      <div className="max-w-[940px] mx-auto px-5 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {isImageRight ? <>{textColumn}{imageColumn}</> : <>{imageColumn}{textColumn}</>}
        </div>
      </div>
    </section>
  )
}
