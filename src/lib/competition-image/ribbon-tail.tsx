/**
 * Reusable ribbon-tail SVG primitive for login-template renderers.
 *
 * Path data: a rectangle with a triangular notch on the left edge (the
 * visible chevron) and a darker right-triangle in the bottom-right corner
 * (the "fold shadow" that peeks out below the ribbon's bottom corner).
 *
 * Both desktop and mobile routes share the same three placement ratios
 * below — they're either purely SVG-derived or pair-locked with the
 * placement rule "tail_top = ribbon_mid", so the tail aligns precisely
 * with the ribbon's corners on any frame size.
 *
 * Width and height are always passed explicitly; SVG uses
 * preserveAspectRatio="none" so the path stretches to fit the ribbon-
 * relative dimensions (mobile is shorter/wider than the SVG's intrinsic
 * 167:229 aspect; desktop is close to it). Same code path for both.
 */
import { hexDarken } from '@/components/puck/shared'

/** Tail width as a fraction of ribbon width. Designer choice; both
 *  frames use ~0.149, rounded here for cleanliness. */
export const TAIL_W_OF_RIBBON = 0.15

/** Tail height as a fraction of ribbon height. Pair-locked with the
 *  placement rule TAIL_TOP = RIBBON.top + RIBBON.height/2: this is the
 *  unique value that makes the SVG's shadow-triangle top edge land
 *  exactly on the ribbon's bottom edge. Derivation: 0.5 × 229 / 178.903
 *  (where 178.903 is the triangle's top y in the 229-unit viewBox). */
export const TAIL_H_OF_RIBBON = 0.640

/** Tail outset (how far tail pokes out past ribbon) as a fraction of
 *  tail width. Purely SVG-derived: 93.667 / 167 (the triangle's inner-
 *  vertex x in the 167-unit viewBox). With this value, the triangle's
 *  LEFT edge lands exactly on the ribbon's LEFT edge. */
export const TAIL_OUTSET_OF_TAIL = 0.561

/** 4-tier red layering: overlay → tail body → ribbon body → fold shadow.
 *  Shared with route files that compute RIBBON_DARKEN as a geometric
 *  mean involving this. */
export const SHADOW_DARKEN = 0.5

// Future: parse the magic numbers (178.903, 93.667, 167, 229) directly
// from the path `d` string so the ratios above auto-derive. Premature
// while the SVG is stable; single source here is fine.

/**
 * width/height/left/right/top accept `number | string` so callers can pass
 * either pixels or percentage strings ("50%", "64%"). Login banner positions
 * the tail relative to its auto-sized ribbon parent via percentages.
 */
export function RibbonTail({
  bodyColor,
  width,
  height,
  left,
  right,
  top,
  transform,
  flip = false,
}: {
  bodyColor: string
  width: number | string
  height: number | string
  left?: number | string
  right?: number | string
  top: number | string
  transform?: string
  flip?: boolean
}) {
  const flipT = flip ? 'scaleX(-1)' : ''
  const combinedTransform = [flipT, transform].filter(Boolean).join(' ') || undefined
  return (
    <svg
      preserveAspectRatio="none"
      viewBox="0 0 167 229"
      style={{
        position: 'absolute',
        ...(left !== undefined ? { left } : {}),
        ...(right !== undefined ? { right } : {}),
        top,
        width,
        height,
        ...(combinedTransform ? { transform: combinedTransform } : {}),
      }}
    >
      <path fill={bodyColor} d="M0 229h166.941V0H0l45.807 116.289z" />
      <path
        fill={hexDarken(bodyColor, SHADOW_DARKEN)}
        d="m166.958 228.997-73.291-50.094h73.291z"
      />
    </svg>
  )
}
