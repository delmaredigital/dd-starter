/**
 * Shared primitives for competition Puck components.
 *
 * Section widths — Figma uses 3 tiers (plus full-bleed). 0.75 scale from
 * a 1728 design frame. The rule is structural, not pixel-exact: 6xl is
 * reserved for two-col sections where a dense text block sits next to an
 * image and needs horizontal room to breathe. Single-col text, grids, and
 * hero/CTA blocks drop to 5xl.
 *
 *   Tier        Tailwind           Sections
 *   ────────────────────────────────────────────────────────────────
 *   A  small    max-w-[960px]      AwardsSection, Step-into strip
 *   B  medium   max-w-5xl (1024)   BenefitsGrid, CompetitionFormatV2,
 *                                   CompetitionFooter, CompetitionHero
 *                                   content, SummaryGrid,
 *                                   CompetitionStructure, FeeWaiver,
 *                                   JoinCTA, EligibilitySection
 *   C  large    max-w-6xl (1152)   TwoColumnFeature (About UNC, About
 *                                   League, Fostering), DeadlineTable
 *   full-bleed  no cap             CompetitionHero outer, AlgoEdFooter
 *
 * Typography scale — Figma designs at 1728px, scaled 0.75×.
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
 *
 * Divider stroke: border-gray-300 (#d1d5db). Figma token --stroke-0 / Gray 200
 * (#D0D4D9), snapped to gray-300 (1.3 avg channel diff). Used for all section
 * dividers: nav vertical, awards vertical, fee waiver horizontal.
 *
 * Default fallback: `val || defaultProps.X` in render, `placeholder: defaultProps.X`
 * in field def. One source of truth. Only for fields that must have a value (headings,
 * body text). NOT for optional fields where empty = hide (CTAs, subtitles).
 *
 * Responsive spacing — two layouts split at `md` (768px). Mobile spacing = desktop ÷ 2,
 * rounded to nearest Tailwind step. Example: `py-5 md:py-10`, `gap-2 md:gap-4`.
 * `lg` is reserved for nav visibility and container padding only (`lg:px-0`).
 */
import { RichTextBoundary } from './RichTextBoundary'

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

/** CSS var references for the two-color brand system set on the Puck root. */
export const BRAND_DARK = 'var(--primary-dark, #222)'
export const BRAND_BRIGHT = 'var(--primary-bright, #222)'
export const HERO_OVERLAY = 'var(--hero-overlay, var(--primary-bright, #222))'
export const HERO_TEXT = 'var(--hero-text, #ffffff)'
export const HIGHLIGHT_BG = 'var(--highlight-bg, #ffffff)'
export const HIGHLIGHT_TEXT = 'var(--highlight-text, var(--primary-dark, #222))'
export const CTA_BG = 'var(--cta-bg, var(--primary-dark, #222))'
export const CTA_TEXT = 'var(--cta-text, #ffffff)'
export const CTA2_BG = 'var(--cta2-bg, #ffffff)'
export const CTA2_TEXT = 'var(--cta2-text, var(--primary-dark, #222))'
export const CTA2_BORDER = 'var(--cta2-border, var(--primary-dark, #222))'

/** Light grey surface used for card backgrounds and alternating sections. */
export const SURFACE_GREY = '#f2f3f0'

/** Fallback bg for browsers without color-mix() — 10% of #222 on white. */
export const TINT_FALLBACK_CLASS = 'bg-[#e9e9e9]'

/**
 * Renders Puck richtext fields with prose styling.
 * Puck's pipeline (useRichtextProps / field transforms) converts richtext data
 * into a React element before it reaches the render function — both in the editor
 * (via getRichTextTransform) and on the server (via useRichtextProps in ServerRender,
 * provided the server config declares `fields`). Just render the value as a child.
 *
 * Wraps children in RichTextBoundary to catch TipTap crashes on empty strings —
 * Puck's RichTextRender creates invalid ProseMirror nodes from "" content.
 */
export function RichText({ children, className }: { children: React.ReactNode; className?: string }) {
  if (!children) return null
  return (
    <div className={`prose prose-sm max-w-none ${className ?? ''}`}>
      <RichTextBoundary>{children}</RichTextBoundary>
    </div>
  )
}

/** CTA button link styled for competition pages. */
export function CompetitionCTA({
  text,
  href,
  bgColor,
  textColor,
  padding,
  target,
  border,
  fullWidth,
}: {
  text: string
  href: string
  bgColor: string
  textColor: string
  padding?: string
  target?: '_blank'
  border?: string
  fullWidth?: boolean
}) {
  if (!text) return null
  return (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={`rounded-md text-sm font-bold leading-normal no-underline text-center shadow-sm py-3 px-5 hover:opacity-90 hover:bg-black/5 active:opacity-80 active:bg-black/10 transition ${fullWidth ? 'block w-full' : 'inline-block'}`}
      style={{
        color: textColor,
        backgroundColor: bgColor,
        padding,
        border,
      }}
    >
      {text}
    </a>
  )
}
