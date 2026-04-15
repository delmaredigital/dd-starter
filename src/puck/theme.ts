/** Hero theme options and resolver — shared between client and server Puck configs. */

export const DEFAULT_HERO_THEME = 'bright-white-dark'

export const HERO_THEMES = [
  { label: 'Bright / White + Dark', value: 'bright-white-dark' },
  { label: 'Bright / White + Bright', value: 'bright-white-bright' },
  { label: 'Bright / Dark + White', value: 'bright-dark-white' },
  { label: 'Bright / Dark + Bright', value: 'bright-dark-bright' },
  { label: 'Dark / White + Dark', value: 'dark-white-dark' },
  { label: 'Dark / White + Bright', value: 'dark-white-bright' },
  { label: 'Dark / Bright + White', value: 'dark-bright-white' },
  { label: 'Dark / Bright + Dark', value: 'dark-bright-dark' },
]

export const CTA_STYLES = [
  { label: 'Classic', value: 'classic' },
  { label: 'Bright Forward', value: 'bright-forward' },
  { label: 'Warm Contrast', value: 'warm-contrast' },
  { label: 'Dark Signature', value: 'dark-signature' },
  { label: 'Classic with Pop', value: 'classic-pop' },
  { label: 'Full Identity', value: 'full-identity' },
]

export const DEFAULT_CTA_STYLE = 'classic'

const D = 'var(--primary-dark)'
const B = 'var(--primary-bright)'
const W = '#ffffff'

const CTA_STYLE_MAP: Record<string, { bg: string; text: string; bg2: string; text2: string; border2: string }> = {
  'classic':        { bg: D, text: W, bg2: W, text2: D, border2: D },
  'bright-forward': { bg: B, text: W, bg2: W, text2: D, border2: D },
  'warm-contrast':  { bg: B, text: D, bg2: W, text2: D, border2: D },
  'dark-signature': { bg: D, text: B, bg2: W, text2: D, border2: D },
  'classic-pop':    { bg: D, text: W, bg2: B, text2: D, border2: D },
  'full-identity':  { bg: D, text: B, bg2: B, text2: D, border2: D },
}

export function resolveCtaStyle(style: string) {
  return CTA_STYLE_MAP[style] ?? CTA_STYLE_MAP[DEFAULT_CTA_STYLE]
}

export function resolveTheme(theme: string, heroTextOverride?: string) {
  const [overlay, highlightBg, highlightText] = (theme || DEFAULT_HERO_THEME).split('-') as [string, string, string]
  const v = (token: string) =>
    token === 'dark' ? 'var(--primary-dark)' : token === 'bright' ? 'var(--primary-bright)' : '#ffffff'
  const oppositeOverlay = overlay === 'dark' ? 'bright' : 'dark'
  const heroText = heroTextOverride === 'white' ? '#ffffff'
    : heroTextOverride === 'primary' ? v(oppositeOverlay)
    : v(highlightBg)
  return {
    overlay: v(overlay),
    heroText,
    highlightBg: v(highlightBg),
    highlightText: v(highlightText),
  }
}
