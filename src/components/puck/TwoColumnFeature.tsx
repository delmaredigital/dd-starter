/**
 * TwoColumnFeature — two-column section with heading, body text, CTA on one side
 * and a feature image on the other.
 *
 * Used for: "Make an Impact", "Compete in Multiple Categories", "Join the Challenge"
 *
 * Reference: docs/reference/webflow/mit-ewb.html section.section-71
 * Source CSS: .section-71, .quick-stack-37, .cell-77, .cell-76, .text-block-139, .paragraph-56
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField, type MediaReference } from '@delmaredigital/payload-puck/fields'
import { AccentBar, CompetitionCTA, safeHex } from './shared'

export interface TwoColumnFeatureProps {
  heading: string
  body: string
  ctaText: string
  ctaLink: string
  featureImage: MediaReference | null
  layout: 'image-right' | 'image-left'
  primaryColor: string
  accentBarImage: MediaReference | null
}

const defaultProps: TwoColumnFeatureProps = {
  heading: 'Section Heading',
  body: 'Section body text goes here.',
  ctaText: 'Competition Portal',
  ctaLink: '/portal',
  featureImage: null,
  layout: 'image-right',
  primaryColor: '#a31f35',
  accentBarImage: null,
}

function TwoColumnFeatureRender({
  heading,
  body,
  ctaText,
  ctaLink,
  featureImage,
  layout,
  primaryColor,
  accentBarImage,
}: TwoColumnFeatureProps) {
  const color = safeHex(primaryColor)
  const isImageRight = layout === 'image-right'

  const textColumn = (
    <div className="flex flex-col justify-center items-start">
      <h2 className="text-[22px] font-bold leading-[30px] mb-0 font-poppins text-[#333]">
        {heading}
      </h2>

      <AccentBar image={accentBarImage} primaryColor={color} />

      <p className="text-sm leading-5 mb-10 text-[#333] whitespace-pre-line">
        {body}
      </p>

      <CompetitionCTA text={ctaText} href={ctaLink} bgColor={color} textColor="#ffffff" />
    </div>
  )

  const imageColumn = (
    <div className="flex justify-center items-center">
      {featureImage?.url && (
        <img src={featureImage.url} alt={featureImage.alt || ''} className="max-w-full h-auto" />
      )}
    </div>
  )

  return (
    <section className="py-10">
      <div className="max-w-[940px] mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {isImageRight ? (
            <>
              {textColumn}
              {imageColumn}
            </>
          ) : (
            <>
              {imageColumn}
              {textColumn}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export const TwoColumnFeatureConfig: ComponentConfig<TwoColumnFeatureProps> = {
  label: 'Two Column Feature',
  fields: {
    heading: { type: 'text', label: 'Heading' },
    body: { type: 'textarea', label: 'Body Text' },
    ctaText: { type: 'text', label: 'CTA Button Text (leave empty to hide)' },
    ctaLink: { type: 'text', label: 'CTA Button Link' },
    featureImage: createMediaField({ label: 'Feature Image' }),
    layout: {
      type: 'radio',
      label: 'Layout',
      options: [
        { label: 'Image Right', value: 'image-right' },
        { label: 'Image Left', value: 'image-left' },
      ],
    },
    primaryColor: { type: 'text', label: 'Brand Color (hex)' },
    accentBarImage: createMediaField({ label: 'Accent Bar Image (optional — falls back to colored bar)' }),
  },
  defaultProps,
  render: TwoColumnFeatureRender,
}
