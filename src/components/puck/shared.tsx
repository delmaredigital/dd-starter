/**
 * Shared primitives for competition Puck components.
 */
const HEX_COLOR_RE = /^#[0-9a-fA-F]{3,8}$/

/** Validates a hex color string. Returns the color if valid, fallback otherwise. */
export function safeHex(color: string, fallback = '#333'): string {
  return HEX_COLOR_RE.test(color) ? color : fallback
}

/** Accent bar — 184x7px colored bar matching source Rectangle 34624656 (semi-transparent brand color). */
export function AccentBar({ primaryColor }: { primaryColor: string }) {
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
  padding = '10px 70px',
  target,
  border,
  lineHeight,
}: {
  text: string
  href: string
  bgColor: string
  textColor: string
  padding?: string
  target?: '_blank'
  border?: string
  lineHeight?: string
}) {
  if (!text) return null
  return (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className="rounded text-base font-semibold no-underline inline-block text-center font-poppins"
      style={{
        color: safeHex(textColor),
        backgroundColor: safeHex(bgColor),
        padding,
        border,
        lineHeight,
      }}
    >
      {text}
    </a>
  )
}
