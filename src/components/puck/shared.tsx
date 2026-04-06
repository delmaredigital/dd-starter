/**
 * Shared primitives for competition Puck components.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'

const HEX_COLOR_RE = /^#[0-9a-fA-F]{3,8}$/

/** Validates a hex color string. Returns the color if valid, fallback otherwise. */
export function safeHex(color: string, fallback = '#333'): string {
  return HEX_COLOR_RE.test(color) ? color : fallback
}

/** Accent bar — renders an uploaded image or a CSS colored bar as fallback. */
export function AccentBar({ image, primaryColor }: { image: MediaReference | null; primaryColor: string }) {
  if (image?.url) {
    return <img src={image.url} alt="" className="mt-1.5 mb-[30px]" />
  }
  return (
    <div
      className="w-[184px] h-[7px] rounded mt-1.5 mb-[30px]"
      style={{ backgroundColor: safeHex(primaryColor) }}
    />
  )
}

/** CTA button link styled for competition pages. */
export function CompetitionCTA({
  text,
  href,
  bgColor,
  textColor,
}: {
  text: string
  href: string
  bgColor: string
  textColor: string
}) {
  if (!text) return null
  return (
    <a
      href={href}
      className="rounded text-base font-semibold no-underline inline-block text-center font-poppins"
      style={{
        color: safeHex(textColor),
        backgroundColor: safeHex(bgColor),
        padding: '10px 70px',
      }}
    >
      {text}
    </a>
  )
}
