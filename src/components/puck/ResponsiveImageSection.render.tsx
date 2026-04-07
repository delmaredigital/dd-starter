/**
 * ResponsiveImageSection — render function and types.
 * Server-safe: no client-only imports.
 *
 * Generic section with optional heading + separate desktop/mobile images.
 * Used for timelines, infographics, or any content that needs
 * different images per breakpoint.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'

export interface ResponsiveImageSectionProps {
  heading: string
  desktopImage: MediaReference | null
  mobileImage: MediaReference | null
}

export const defaultProps: ResponsiveImageSectionProps = {
  heading: '',
  desktopImage: null,
  mobileImage: null,
}

export function ResponsiveImageSectionRender({
  heading, desktopImage, mobileImage,
}: ResponsiveImageSectionProps) {
  return (
    <section style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="max-w-[940px] mx-auto px-4 md:px-0">
        {heading && (
          <h2
            className="font-bold text-center mt-0 mb-[40px]"
            style={{ fontSize: '26px', lineHeight: '35px' }}
          >
            {heading}
          </h2>
        )}
        {desktopImage?.url && (
          <img
            src={desktopImage.url}
            alt={desktopImage.alt || heading}
            className="hidden md:block w-full"
          />
        )}
        {mobileImage?.url && (
          <img
            src={mobileImage.url}
            alt={mobileImage.alt || heading}
            className="block md:hidden w-full"
          />
        )}
      </div>
    </section>
  )
}
