/**
 * Shared primitives for competition Puck components.
 *
 * Typography scale — Figma designs at 1728px, scaled 0.75× for 940px container.
 * All sizes use Tailwind stock classes. Floor: 12px (text-xs) for readability.
 *
 *   Role              Figma   Ours    Tailwind       Scale
 *   ─────────────────────────────────────────────────────────
 *   Hero title        65px    48px    text-5xl       0.74×
 *   Section heading   40px    30px    text-3xl       0.75×
 *   Audience label    32px    24px    text-2xl       0.75×
 *   Subtitle/elig.    24px    18px    text-lg        0.75×
 *   Card title        24px    18px    text-lg        0.75×
 *   Body text         20px    15px    text-[15px]    0.75×
 *   Small/caption     16px    12px    text-xs        0.75×
 *
 *   (mobile: text-3xl = 30px)
 *   Target scale: 0.75×. Deviations due to snapping to Tailwind stock sizes.
 *   Floor: 12px (text-xs) for readability. Pure 0.75× of Figma values below
 *   16px would produce sub-12px — we floor at 12px instead.
 *
 * Line-height patterns (from Figma audit, Tailwind stock):
 *
 *   Role                Figma     Tailwind          Notes
 *   ─────────────────────────────────────────────────────────
 *   Body text           160%      leading-relaxed   Global default on <article> (1.625)
 *   All headings        130%      leading-[1.3]      Section headings, card sub-headings, round titles
 *   Hero display        130%      leading-[1.3]      Same as headings
 *
 *   Body text inherits from globals.css <article> — no per-component override needed.
 *   Headings should use leading-tight explicitly (Tailwind body default is looser).
 */
const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/

/** Validates a hex color string. Returns the color if valid, fallback otherwise. */
export function safeHex(color: string, fallback = '#333'): string {
  return HEX_COLOR_RE.test(color) ? color : fallback
}

/** Normalises hex to 6-digit body (no #). */
function normalizeHex(hex: string): string {
  let clean = safeHex(hex).replace('#', '')
  if (clean.length === 3) clean = clean.split('').map(c => c + c).join('')
  return clean.slice(0, 6)
}

/** Converts hex + alpha (0-1) to modern CSS rgb() syntax. Handles 3/6/8-digit hex. */
export function hexAlpha(hex: string, alpha: number): string {
  const clean = normalizeHex(hex)
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgb(${r} ${g} ${b} / ${alpha})`
}

/** Renders CMS rich text HTML with prose styling. Content from Puck admin (trusted). */
export function RichText({ html, className }: { html: string; className?: string }) {
  if (!html) return null
  return (
    <div
      className={`prose prose-sm max-w-none ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

/** Accent bar — 184x7px colored bar matching source Rectangle 34624656 (semi-transparent brand color). */
export function AccentBar({ primaryColor }: { primaryColor: string }) {
  return (
    <div
      className="w-[184px] h-[7px] rounded mt-1.5 mb-5"
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
  fullWidth,
}: {
  text: string
  href: string
  bgColor: string
  textColor: string
  padding?: string
  target?: '_blank'
  border?: string
  lineHeight?: string
  fullWidth?: boolean
}) {
  if (!text) return null
  return (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={`rounded text-base font-semibold no-underline text-center ${fullWidth ? 'block w-full' : 'inline-block'}`}
      style={{
        color: textColor,
        backgroundColor: bgColor,
        padding,
        border,
        lineHeight,
      }}
    >
      {text}
    </a>
  )
}
