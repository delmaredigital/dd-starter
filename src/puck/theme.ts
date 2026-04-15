/** Hero theme options and resolver — shared between client and server Puck configs. */

export const DEFAULT_HERO_THEME = 'bright-white-dark'

export const HERO_THEMES = [
  { label: 'Bright bg → white bar (highlight), dark text', value: 'bright-white-dark' },
  { label: 'Bright bg → white bar (highlight), bright text', value: 'bright-white-bright' },
  { label: 'Bright bg → dark bar (highlight), white text', value: 'bright-dark-white' },
  { label: 'Bright bg → dark bar (highlight), bright text', value: 'bright-dark-bright' },
  { label: 'Dark bg → white bar (highlight), dark text', value: 'dark-white-dark' },
  { label: 'Dark bg → white bar (highlight), bright text', value: 'dark-white-bright' },
  { label: 'Dark bg → bright bar (highlight), white text', value: 'dark-bright-white' },
  { label: 'Dark bg → bright bar (highlight), dark text', value: 'dark-bright-dark' },
]

export const CTA_STYLES = [
  { label: 'Classic — [dark bg, white text] + [white bg, dark text]', value: 'classic' },
  { label: 'Bright Forward — [bright bg, white text] + [white bg, dark text]', value: 'bright-forward' },
  { label: 'Warm Contrast — [bright bg, dark text] + [white bg, dark text]', value: 'warm-contrast' },
  { label: 'Dark Signature — [dark bg, bright text] + [white bg, dark text]', value: 'dark-signature' },
  { label: 'Classic with Pop — [dark bg, white text] + [bright bg, dark text]', value: 'classic-pop' },
  { label: 'Full Identity — [dark bg, bright text] + [bright bg, dark text]', value: 'full-identity' },
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
