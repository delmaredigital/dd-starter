/**
 * Proportional sizing for competition-image renderers.
 *
 * Each template (OG, login-desktop, …) picks its own canvas size and base
 * title-font px, then `deriveSizes(titleFontPx)` returns all dependent
 * sizes (paddings, gaps, radii, audience font) from a single shared ratio
 * set. Templates remain free to pick their own canvas, alignment, and
 * composition — only the proportional relationships are shared.
 *
 * The ratios below are calibrated against the existing OG layout
 * (titleFont = 60). Calling `deriveSizes(60)` reproduces OG's prior
 * hardcoded pixel values exactly, so the OG output stays byte-identical
 * after refactoring.
 *
 * --- Title line-height contract (CONFIRMED FROM FIGMA, do not guess) ---
 *   Lines 1 + 3: ALL templates use 1.30.
 *   Highlight pill (line 2):
 *     hero  (CompetitionHero.render.tsx)            = 1.70
 *     og    (api/og/route.tsx)                      = 1.55
 *     login (api/competition-image/login/route.tsx) = 1.30 (no inflation)
 * Hero/OG inflate the pill for emphasis; login banner intentionally doesn't
 * (compact ribbon, tight rhythm). Probe Figma textNode style.lineHeightPx /
 * fontSize before changing any value above.
 */

const RATIOS = {
  titleGap: 16 / 60,
  highlightPadX: 12 / 60,
  highlightPadY: 6 / 60,
  highlightRadius: 12 / 60,
  audienceFont: 30 / 60,
}

export interface ProportionalSizes {
  titleFont: number
  titleGap: number
  highlightPadding: string
  highlightRadius: number
  audienceFont: number
}

export function deriveSizes(titleFontPx: number): ProportionalSizes {
  const titleGap = Math.round(titleFontPx * RATIOS.titleGap)
  const highlightPadX = Math.round(titleFontPx * RATIOS.highlightPadX)
  const highlightPadY = Math.round(titleFontPx * RATIOS.highlightPadY)
  const highlightRadius = Math.round(titleFontPx * RATIOS.highlightRadius)
  const audienceFont = Math.round(titleFontPx * RATIOS.audienceFont)
  return {
    titleFont: titleFontPx,
    titleGap,
    highlightPadding: `${highlightPadY}px ${highlightPadX}px`,
    highlightRadius,
    audienceFont,
  }
}
