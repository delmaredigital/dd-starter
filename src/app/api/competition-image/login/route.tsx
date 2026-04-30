/**
 * Dynamic login-banner image generator (desktop + mobile variants).
 * Serves at /api/competition-image/login?slug=<slug>&variant=desktop|mobile.
 *
 * Consumed by the Angular student-app split-pane login screen:
 *  - desktop variant (1392×2560 portrait): the tall left-side panel
 *  - mobile variant (812×375 landscape): the top-of-screen banner
 * Admin pastes the URL into the matching `CompetitionEvents` field to
 * override any manually-uploaded PNG.
 *
 * Both variants share identical composition: hero photo bg → uniform
 * brand overlay → hero illustration → ribbon tails → central title
 * ribbon (3 lines, middle line highlighted) → host logo pill above
 * ribbon → laurel below ribbon. Only canvas size and per-variant
 * literals differ; layout shape is identical.
 *
 * Layout philosophy — content-driven sizing, not fixed:
 *   - Ribbon HEIGHT is auto from text content (Yoga flex auto-sizing).
 *     Long titles wrap and the ribbon grows to fit, no clipping.
 *   - Vertical rhythm comes from one `lineHeight: 1.30` on the title
 *     block — same number governs spacing between adjacent flex
 *     items AND between wrapped visual lines inside an item.
 *   - Tails sit inside the ribbon as absolute children with
 *     `top: 50%, height: 64%, transform: translateY(-50%)`. They
 *     centre on and scale with the ribbon's resolved height, no
 *     two-pass measurement needed (Yoga supports % positioning).
 *   - Host pill placement uses `pill_top = ribbon_top - pill_h ×
 *     (1 - overlapRatio)` — the bottom `overlapRatio` portion of the
 *     pill overlaps the ribbon top. Computable since ribbon top is
 *     fixed (only its height is dynamic).
 *   - Laurel sits in flex flow below the ribbon (`gap`-controlled),
 *     so it auto-positions when the ribbon grows.
 *
 * Output: SVG (text/xml). Satori handles flex layout + text. The
 * BACKGROUND PHOTO, brand overlay, hero ILLUSTRATION, and host-pill
 * image are spliced as raw <image href="cdn.url"> / <rect> after
 * Satori returns — keeps the response tiny (Satori has no flag to
 * preserve hrefs; see vercel/satori PR #472).
 *
 * Tail dimensions: see `ribbon-tail.tsx` for the three SVG-tied ratios
 * (TAIL_W_OF_RIBBON, TAIL_H_OF_RIBBON, TAIL_OUTSET_OF_TAIL) and the
 * alignment guarantees they encode (triangle ↔ ribbon corners).
 */
import satori from 'satori'
import { escapeAttribute } from 'entities'
import { hexDarken } from '@/components/puck/shared'
import { COMPETITION_IMAGE_FONTS } from '@/lib/competition-image/fonts'
import { LAUREL_BADGE } from '@/lib/competition-image/assets'
import { loadCompetitionImageData } from '@/lib/competition-image/loader'
import {
  RibbonTail,
  SHADOW_DARKEN,
  TAIL_W_OF_RIBBON,
  TAIL_OUTSET_OF_TAIL,
} from '@/lib/competition-image/ribbon-tail'

// Four-tier red layering — overlay (90% alpha photo wash) → tail body
// → ribbon body → tail fold-shadow. All derived from the same overlay
// color so they shift together per theme.
const TAIL_DARKEN = 0.85
const RIBBON_DARKEN = Math.sqrt(TAIL_DARKEN * SHADOW_DARKEN) /* ≈ 0.65 */

// Title block typography (CONFIRMED FROM FIGMA across 4 login frames).
// See `lib/competition-image/proportions.ts` for the cross-template contract.
const LINE_HEIGHT = 1.3

// Tail height as fraction of ribbon height. Pair-locked with
// `tail_top: 50%` placement (tail centred vertically on ribbon): this
// gives the SVG fold-triangle alignment with the ribbon corners. See
// `ribbon-tail.tsx` for derivation. (Was a separate import constant
// when ribbon height was fixed; now applied as a CSS percentage.)
const TAIL_H_PCT = '64%'

// Pill x-padding as a fraction of font size. Figma mobile shows 3 px
// at fs=25 (= 0.12 em). Desktop bbox math is degenerate; use the same
// ratio. Y-padding is 0 — the pill background fills the line-height
// envelope, which already provides the visible breathing room.
const PILL_PADDING_X_EM = 0.12

/**
 * Per-variant config. Every value except canvas dimensions is a fraction
 * of the canvas (width or height as appropriate). To add a new variant,
 * append another entry to VARIANTS with the same shape.
 */
interface LoginVariant {
  width: number
  height: number
  titleFontPx: number
  illustration: { wOfCanvas: number }
  hostPill: {
    wOfCanvas: number
    hOfCanvas: number
    paddingOfCanvas: number
    /** Fraction of pill height that overlaps ribbon top.
     *  pill_top = ribbon_top - pill_h × (1 - overlapOfPill). */
    overlapOfPill: number
  }
  ribbon: {
    topOfCanvas: number
    wOfCanvas: number
    paddingTopOfCanvas: number
    paddingBottomOfCanvas: number
    /** Pill <span> border-radius in pixels. Doesn't follow a clean
     *  ratio across variants; per-variant constant. */
    pillCornerPx: number
  }
  laurel: { wOfCanvas: number; gapOfCanvas: number }
}

// Figma desktop frame: node 6519:19576 (Stanford EWB Junior, 1392×2560).
const DESKTOP: LoginVariant = {
  width: 1392,
  height: 2560,
  titleFontPx: 62,
  illustration: { wOfCanvas: 835 / 1392 },
  hostPill: {
    wOfCanvas: 340 / 1392,
    hOfCanvas: 106 / 2560,
    paddingOfCanvas: 17.5 / 2560,
    // Figma desktop: pill bottom overlaps ribbon top by 36 px = 0.34
    // of pill height. (See HOST_PILL geometry in TYPOGRAPHY notes.)
    overlapOfPill: 0.34,
  },
  ribbon: {
    topOfCanvas: 1240 / 2560,
    wOfCanvas: 1120 / 1392,
    // Figma title-line-1 sits 43 px below ribbon top → fraction = 43/2560.
    paddingTopOfCanvas: 43 / 2560,
    // Figma year-line ends ~18 px above ribbon bottom → 18/2560.
    paddingBottomOfCanvas: 18 / 2560,
    // Pill cornerRadius from Figma rectangle (node 34625997).
    pillCornerPx: 6,
  },
  // wOfCanvas: 75% — Figma's 815 (58%) reads too small at this scale.
  laurel: { wOfCanvas: 1044 / 1392, gapOfCanvas: 112 / 2560 },
}

// Figma mobile frame: node 6403:18485 (UNC Junior, 812×375).
const MOBILE: LoginVariant = {
  width: 812,
  height: 375,
  titleFontPx: 25,
  illustration: { wOfCanvas: 330 / 812 },
  hostPill: {
    wOfCanvas: 151 / 812,
    hOfCanvas: 40 / 375,
    paddingOfCanvas: 5 / 375,
    overlapOfPill: 0.475,
  },
  ribbon: {
    topOfCanvas: 168 / 375,
    wOfCanvas: 595 / 812,
    paddingTopOfCanvas: 22 / 375,
    paddingBottomOfCanvas: 8 / 375,
    pillCornerPx: 4,
  },
  laurel: { wOfCanvas: 340 / 812, gapOfCanvas: 8 / 375 },
}

const VARIANTS = { desktop: DESKTOP, mobile: MOBILE } as const
type VariantKey = keyof typeof VARIANTS

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') ?? ''

  // Narrow the query string to a known variant key without lying to the
  // type system; any unknown value falls through to 'desktop'.
  const rawVariant = searchParams.get('variant')
  const variantKey: VariantKey = rawVariant === 'mobile' ? 'mobile' : 'desktop'
  const variant = VARIANTS[variantKey]

  // Optional photo-position knobs to compensate for asymmetry inside the
  // heroImage composite (decorative icons below the school photo, or
  // unequal panels left/right of it):
  //   - `?bottom=0.84` — photo's bottom edge is at 84% of asset height.
  //     Renderer shifts the asset down so that point lands at the ribbon
  //     top; the portion below is covered by the ribbon body. Default 1.0
  //     anchors the composite's full bottom.
  //   - `?centerX=0.4` — photo's horizontal center is at 40% from the
  //     asset's left. Renderer offsets the asset horizontally so that
  //     point lands at the canvas center. Default 0.5 centers the asset.
  const clamp01 = (v: number, fallback: number) =>
    Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : fallback
  const photoOffset = clamp01(Number(searchParams.get('bottom') ?? '1'), 1)
  const photoCenterX = clamp01(Number(searchParams.get('centerX') ?? '0.5'), 0.5)

  console.log(
    `[competition-image] login: variant=${variantKey} slug=${slug} bottom=${photoOffset} centerX=${photoCenterX}`,
  )

  const data = await loadCompetitionImageData(slug)
  if (!data) {
    return new Response('Page not found', { status: 404 })
  }

  // ---------------------------------------------------------------------
  // Layout — every coord is variant-relative; helpers `w`/`h` round
  // fractions to pixels.
  // ---------------------------------------------------------------------
  const WIDTH = variant.width
  const HEIGHT = variant.height
  const w = (frac: number) => Math.round(frac * WIDTH)
  const h = (frac: number) => Math.round(frac * HEIGHT)

  const titleFs = variant.titleFontPx

  const ILLUSTRATION = { width: w(variant.illustration.wOfCanvas) }
  const HOST_PILL = {
    width: w(variant.hostPill.wOfCanvas),
    height: h(variant.hostPill.hOfCanvas),
    padding: h(variant.hostPill.paddingOfCanvas),
  }
  const RIBBON = {
    top: h(variant.ribbon.topOfCanvas),
    width: w(variant.ribbon.wOfCanvas),
    paddingTop: h(variant.ribbon.paddingTopOfCanvas),
    paddingBottom: h(variant.ribbon.paddingBottomOfCanvas),
  }
  const LAUREL = {
    width: w(variant.laurel.wOfCanvas),
    gap: h(variant.laurel.gapOfCanvas),
  }

  // Tail width: known up front because RIBBON.width is fixed. Tail height
  // becomes a percentage at render time (relative to ribbon's auto-sized
  // height). Outset is also pixel-known.
  const TAIL_WIDTH = Math.round(TAIL_W_OF_RIBBON * RIBBON.width)
  const TAIL_OUTSET = Math.round(TAIL_OUTSET_OF_TAIL * TAIL_WIDTH)

  // Host pill placement: bottom `overlapOfPill` of pill overlaps ribbon top.
  const HOST_PILL_TOP =
    RIBBON.top - Math.round(HOST_PILL.height * (1 - variant.hostPill.overlapOfPill))
  const HOST_PILL_LEFT = Math.round((WIDTH - HOST_PILL.width) / 2)

  const { hero, partnerLogo, colors, resolveImageMeta } = data
  const { overlayColor, highlightBg, highlightText, heroText } = colors
  const tailBody = hexDarken(overlayColor, TAIL_DARKEN)
  const ribbonBody = hexDarken(overlayColor, RIBBON_DARKEN)

  const titleLine1 = hero?.titleLine1 || 'Competition'
  const titleLine2 = hero?.titleLine2 || ''
  const titleLine3 = hero?.titleLine3 || ''

  const [heroBgMeta, illustrationMeta, partnerLogoMeta] = await Promise.all([
    resolveImageMeta(hero?.backgroundImage?.url, 'xlarge'),
    resolveImageMeta(hero?.heroImage?.url, 'xlarge'),
    resolveImageMeta(partnerLogo?.url, 'medium'),
  ])

  const illustrationHeight = illustrationMeta
    ? Math.round((ILLUSTRATION.width * illustrationMeta.height) / illustrationMeta.width)
    : 0
  const partnerLogoBoxW = HOST_PILL.width - 2 * HOST_PILL.padding
  const partnerLogoBoxH = HOST_PILL.height - 2 * HOST_PILL.padding

  // Photo overlay — uniform 90% alpha. Hex E6 = round(0.9 × 255). Figma
  // desktop frame spec'd rgba(154,0,0,0.9) — brand red at 0.9. OG's
  // gradient (overlayTopOpacity/BottomOpacity) intentionally not used —
  // Figma specs a uniform overlay for both login templates.
  const overlayFill = `${overlayColor}E6`

  // Title text styling shared across all three lines. Each line is wrapped
  // in a flex-row `justifyContent: 'center'` div so the text content
  // (a span) is horizontally centered within the ribbon body width —
  // textAlign alone doesn't center reliably in Satori for flex-column
  // children that contain only text.
  const titleLineStyle = {
    fontFamily: 'Poppins',
    fontSize: titleFs,
    fontWeight: 700,
    lineHeight: LINE_HEIGHT,
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
    color: heroText,
  }
  const lineCenterRow = { display: 'flex' as const, justifyContent: 'center' as const }

  const svg = await satori(
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        position: 'relative',
      }}
    >
      {/* 1+2. Background photo + brand overlay are spliced into the SVG
           output below as raw <image> + <rect>. */}

      {/* 3. Hero illustration is also spliced below as raw <image href>. */}

      {/* Ribbon-and-laurel stack — flex column starting at canvas-y =
           RIBBON.top. Ribbon's height is auto from text content; laurel
           sits below with a gap. */}
      <div
        style={{
          position: 'absolute',
          top: RIBBON.top,
          left: 0,
          width: WIDTH,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Ribbon area: contains tails (absolute) and ribbon body (flow).
             Tails are siblings of ribbon body so paint order = DOM order =
             tails first, ribbon body on top (covering inner tail edges). */}
        <div
          style={{
            position: 'relative',
            width: RIBBON.width,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Left tail — anchored top at ribbon vertical mid (not centered).
               With height 64% of ribbon, the tail extends from 50% to 114%
               of ribbon height; the bottom 14% peeks below the ribbon, where
               the SVG fold-shadow triangle's top edge lands exactly at the
               ribbon's bottom corner. (DOM order before ribbon-body so it
               paints behind.) */}
          <RibbonTail
            bodyColor={tailBody}
            width={TAIL_WIDTH}
            height={TAIL_H_PCT}
            left={-TAIL_OUTSET}
            top="50%"
          />
          {/* Right tail (mirrored) */}
          <RibbonTail
            bodyColor={tailBody}
            width={TAIL_WIDTH}
            height={TAIL_H_PCT}
            right={-TAIL_OUTSET}
            top="50%"
            flip
          />
          {/* Ribbon body: position relative gives it a stacking position so
               it paints over the tails (DOM order = tails, then body =
               body on top within the same stacking context). */}
          <div
            style={{
              position: 'relative',
              backgroundColor: ribbonBody,
              paddingTop: RIBBON.paddingTop,
              paddingBottom: RIBBON.paddingBottom,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
            }}
          >
            <div style={lineCenterRow}>
              <span style={titleLineStyle}>{titleLine1}</span>
            </div>
            {titleLine2 && (
              <div style={lineCenterRow}>
                <span
                  style={{
                    ...titleLineStyle,
                    color: highlightText,
                    backgroundColor: highlightBg,
                    padding: `0 ${Math.round(titleFs * PILL_PADDING_X_EM)}px`,
                    borderRadius: variant.ribbon.pillCornerPx,
                  }}
                >
                  {titleLine2}
                </span>
              </div>
            )}
            <div style={lineCenterRow}>
              <span style={titleLineStyle}>{titleLine3}</span>
            </div>
          </div>
        </div>

        {/* Laurel — sits below ribbon with `gap` margin. */}
        <img
          src={LAUREL_BADGE}
          width={LAUREL.width}
          style={{ marginTop: LAUREL.gap }}
        />
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: COMPETITION_IMAGE_FONTS,
    },
  )

  // ---------------------------------------------------------------------
  // SVG splicing strategy — bypass Satori for heavy raster layers (bg,
  // illustration, host-pill image) so they reference CDN URLs instead of
  // getting base64-inlined into the response. Construction is plain
  // template-literal XML; CMS URLs run through `entities`'
  // `escapeAttribute()` so any &/</>/"/' is encoded.
  //
  // Forward path if XML construction grows non-trivial:
  //   - 8+ splice points, conditional structure, or nested groups
  //     → switch to `xmlbuilder2` (chainable XML builder, escaping
  //       built-in). The `entities` import would go away.
  //   - Need to inspect/transform Satori's output beyond simple tag
  //     splicing → `fast-xml-parser` (mind 2026 entity-expansion CVEs;
  //     pin a patched version, never feed it untrusted input).
  // Avoid `@xmldom/xmldom` and DOM-style approaches — overkill for 3-4
  // splice points, plus recent serialization advisories.
  //
  // Order: bg → overlay → illustration → (Satori-rendered: ribbon-stack
  // including tails, body, title, laurel). Host pill spliced at END so
  // it paints on top of the ribbon.
  const bgImage = heroBgMeta
    ? `<image x="0" y="0" width="${WIDTH}" height="${HEIGHT}" preserveAspectRatio="xMidYMid slice" href="${escapeAttribute(heroBgMeta.url)}"/>`
    : ''
  const overlayRect = `<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="${heroBgMeta ? overlayFill : overlayColor}"/>`
  // Anchor the illustration's photo region: vertical via photoOffset
  // (asset's y=offset×h lands at ribbon top — so the photo's bottom edge
  // meets ribbon top regardless of asset aspect; the top floats per-asset),
  // horizontal via photoCenterX (asset's x=centerX×w lands at canvas mid).
  const illustrationY = RIBBON.top - Math.round(illustrationHeight * photoOffset)
  const illustrationX = Math.round(WIDTH / 2 - photoCenterX * ILLUSTRATION.width)
  const illustrationImage = illustrationMeta
    ? `<image x="${illustrationX}" y="${illustrationY}" width="${ILLUSTRATION.width}" height="${illustrationHeight}" href="${escapeAttribute(illustrationMeta.url)}"/>`
    : ''
  const hostPill = partnerLogoMeta
    ? `<rect x="${HOST_PILL_LEFT}" y="${HOST_PILL_TOP}" width="${HOST_PILL.width}" height="${HOST_PILL.height}" rx="${HOST_PILL.height / 2}" fill="white"/>` +
      `<image x="${HOST_PILL_LEFT + HOST_PILL.padding}" y="${HOST_PILL_TOP + HOST_PILL.padding}" width="${partnerLogoBoxW}" height="${partnerLogoBoxH}" preserveAspectRatio="xMidYMid meet" href="${escapeAttribute(partnerLogoMeta.url)}"/>`
    : ''
  const out = svg
    .replace(/^<svg [^>]*>/, (m) => `${m}${bgImage}${overlayRect}${illustrationImage}`)
    .replace(/<\/svg>$/, `${hostPill}</svg>`)

  return new Response(out, {
    headers: { 'Content-Type': 'image/svg+xml' },
  })
}
