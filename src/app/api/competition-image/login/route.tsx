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
 * ribbon → laurel below ribbon. Only the canvas size and seven layout
 * fractions differ; everything else (color hierarchy, splice strategy,
 * splice paint order, query-param knobs) is identical.
 *
 * Output: SVG (text/xml). Satori handles layout-heavy work (title text,
 * ribbon tails, ribbon body, laurel). The BACKGROUND PHOTO, brand
 * overlay, hero ILLUSTRATION, and host-pill image are spliced as raw
 * <image href="cdn.url"> / <rect> after Satori returns — keeps the
 * response tiny by referencing CDN URLs the browser fetches at render
 * time, instead of letting Satori inline ~hundreds of KB of base64
 * (Satori has no flag to preserve hrefs; see vercel/satori PR #472).
 *
 * Sizing math: titleFont per variant; highlight pill padding, title
 * gap, and pill border-radius come from `deriveSizes(titleFontPx)`.
 * Tail dimensions derive from ribbon dimensions via three SVG-tied
 * ratios in `ribbon-tail.tsx`; tail top sits at ribbon vertical mid
 * so the SVG triangle's left/top edges land precisely on the ribbon's
 * left/bottom edges. Same rule on both variants.
 */
import satori from 'satori'
import { escapeAttribute } from 'entities'
import { hexDarken } from '@/components/puck/shared'
import { COMPETITION_IMAGE_FONTS } from '@/lib/competition-image/fonts'
import { LAUREL_BADGE } from '@/lib/competition-image/assets'
import { loadCompetitionImageData } from '@/lib/competition-image/loader'
import { deriveSizes } from '@/lib/competition-image/proportions'
import {
  RibbonTail,
  SHADOW_DARKEN,
  TAIL_W_OF_RIBBON,
  TAIL_H_OF_RIBBON,
  TAIL_OUTSET_OF_TAIL,
} from '@/lib/competition-image/ribbon-tail'

// Four-tier red layering — overlay (90% alpha photo wash) → tail body
// → ribbon body → tail fold-shadow. All derived from the same overlay
// color so they shift together per theme.
const TAIL_DARKEN = 0.85
const RIBBON_DARKEN = Math.sqrt(TAIL_DARKEN * SHADOW_DARKEN) /* ≈ 0.65 */

/**
 * Per-variant config. Every value except canvas dimensions is a fraction
 * of the canvas (width or height as appropriate) — keeps the design
 * intent canvas-agnostic. To add a new variant (e.g. square 1080×1080),
 * append another entry to VARIANTS with the same shape.
 *
 * Tail dimensions are NOT here — they derive from `ribbon` via shared
 * SVG-tied ratios so the alignment with the ribbon's bottom corners is
 * preserved automatically across variants.
 */
interface LoginVariant {
  width: number
  height: number
  titleFontPx: number
  illustration: { wOfCanvas: number }
  hostPill: {
    topOfCanvas: number
    wOfCanvas: number
    hOfCanvas: number
    paddingOfCanvas: number
  }
  ribbon: { topOfCanvas: number; wOfCanvas: number; hOfCanvas: number }
  laurel: { topOfCanvas: number; wOfCanvas: number }
  /** Padding from ribbon-top to first title line, as fraction of canvas-h. */
  ribbonPaddingTop: number
}

// Figma desktop frame: node 6519:19576 (Stanford EWB Junior, 1392×2560).
const DESKTOP: LoginVariant = {
  width: 1392,
  height: 2560,
  titleFontPx: 62,
  illustration: { wOfCanvas: 835 / 1392 },
  hostPill: {
    topOfCanvas: 1170 / 2560,
    wOfCanvas: 340 / 1392,
    hOfCanvas: 106 / 2560,
    paddingOfCanvas: 17.5 / 2560,
  },
  ribbon: { topOfCanvas: 1240 / 2560, wOfCanvas: 1120 / 1392, hOfCanvas: 366 / 2560 },
  // wOfCanvas: 75% — Figma's 815 (58%) reads too small at this scale.
  laurel: { topOfCanvas: 1717 / 2560, wOfCanvas: 1044 / 1392 },
  // ribbonPaddingTop derives from "title-line-1 cy 1331 minus ~half line-height"
  // relative to ribbon top.
  ribbonPaddingTop: 50 / 2560,
}

// Figma mobile frame: node 6403:18485 (UNC Junior, 812×375).
const MOBILE: LoginVariant = {
  width: 812,
  height: 375,
  titleFontPx: 25,
  illustration: { wOfCanvas: 330 / 812 },
  hostPill: {
    topOfCanvas: 147 / 375,
    wOfCanvas: 151 / 812,
    hOfCanvas: 40 / 375,
    paddingOfCanvas: 5 / 375,
  },
  ribbon: { topOfCanvas: 168 / 375, wOfCanvas: 595 / 812, hOfCanvas: 139 / 375 },
  laurel: { topOfCanvas: 315 / 375, wOfCanvas: 340 / 812 },
  ribbonPaddingTop: 22 / 375,
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
  // Layout — every coord is variant-relative; all literals already in
  // the variant config above. Helpers `w`/`h` round fractions to pixels.
  // ---------------------------------------------------------------------
  const WIDTH = variant.width
  const HEIGHT = variant.height
  const w = (frac: number) => Math.round(frac * WIDTH)
  const h = (frac: number) => Math.round(frac * HEIGHT)
  const SIZES = deriveSizes(variant.titleFontPx)

  const ILLUSTRATION = { width: w(variant.illustration.wOfCanvas) }
  const HOST_PILL = {
    top: h(variant.hostPill.topOfCanvas),
    width: w(variant.hostPill.wOfCanvas),
    height: h(variant.hostPill.hOfCanvas),
    padding: h(variant.hostPill.paddingOfCanvas),
  }
  const RIBBON = {
    top: h(variant.ribbon.topOfCanvas),
    width: w(variant.ribbon.wOfCanvas),
    height: h(variant.ribbon.hOfCanvas),
  }
  const LAUREL = {
    top: h(variant.laurel.topOfCanvas),
    width: w(variant.laurel.wOfCanvas),
  }

  // Tail dims: pure functions of ribbon dims. See ribbon-tail.tsx for
  // the SVG-derived ratios and the alignment guarantees they encode.
  const TAIL_WIDTH = Math.round(TAIL_W_OF_RIBBON * RIBBON.width)
  const TAIL_HEIGHT = Math.round(TAIL_H_OF_RIBBON * RIBBON.height)
  const TAIL_OUTSET = Math.round(TAIL_OUTSET_OF_TAIL * TAIL_WIDTH)

  const RIBBON_LEFT = (WIDTH - RIBBON.width) / 2
  const TAIL_INSET = TAIL_WIDTH - TAIL_OUTSET
  const TAIL_TOP = RIBBON.top + Math.round(RIBBON.height / 2)
  const LEFT_TAIL_LEFT = RIBBON_LEFT - TAIL_OUTSET
  const RIGHT_TAIL_LEFT = RIBBON_LEFT + RIBBON.width - TAIL_INSET
  const HOST_PILL_LEFT = (WIDTH - HOST_PILL.width) / 2
  const LAUREL_LEFT = (WIDTH - LAUREL.width) / 2

  const RIBBON_PADDING_TOP = h(variant.ribbonPaddingTop)
  const RIBBON_GAP = SIZES.titleGap

  const { hero, partnerLogo, colors, resolveImageMeta } = data
  const { overlayColor, highlightBg, highlightText, heroText } = colors
  const tailBody = hexDarken(overlayColor, TAIL_DARKEN)
  const ribbonBody = hexDarken(overlayColor, RIBBON_DARKEN)

  const titleLine1 = hero?.titleLine1 || 'Competition'
  const titleLine2 = hero?.titleLine2 || ''
  const titleLine3 = hero?.titleLine3 || ''

  // Resolve URLs + intrinsic dimensions (no fetching). Output SVG
  // references each image via <image href> so the browser fetches them
  // at render time — keeps the response payload tiny and lets Cloudflare
  // Polish negotiate webp/avif transparently per client.
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
           output below as raw <image> + <rect>. See splice section
           comment for rationale (Satori has no preserve-href flag). */}

      {/* 3. Hero illustration is also spliced below as raw <image href>. */}

      {/* 4. Left ribbon tail (renders before ribbon so its right edge
           tucks behind the ribbon body — Satori has no z-index, paint
           order = DOM order). */}
      <RibbonTail
        bodyColor={tailBody}
        width={TAIL_WIDTH}
        height={TAIL_HEIGHT}
        left={LEFT_TAIL_LEFT}
        top={TAIL_TOP}
      />

      {/* 5. Right ribbon tail (mirrored) */}
      <RibbonTail
        bodyColor={tailBody}
        width={TAIL_WIDTH}
        height={TAIL_HEIGHT}
        left={RIGHT_TAIL_LEFT}
        top={TAIL_TOP}
        flip
      />

      {/* 6. Central title ribbon — geometric-mean darken of overlayColor,
           sitting between the tail body and the fold shadow so all three
           red layers read as a coherent depth stack. */}
      <div
        style={{
          position: 'absolute',
          left: RIBBON_LEFT,
          top: RIBBON.top,
          width: RIBBON.width,
          height: RIBBON.height,
          background: ribbonBody,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: RIBBON_PADDING_TOP,
          gap: RIBBON_GAP,
        }}
      >
        <span
          style={{
            fontFamily: 'Poppins',
            fontSize: SIZES.titleFont,
            fontWeight: 700,
            color: heroText,
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {titleLine1}
        </span>
        {titleLine2 && (
          <span
            style={{
              display: 'flex',
              fontFamily: 'Poppins',
              fontSize: SIZES.titleFont,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: highlightText,
              backgroundColor: highlightBg,
              padding: SIZES.highlightPadding,
              borderRadius: SIZES.highlightRadius,
            }}
          >
            {titleLine2}
          </span>
        )}
        <span
          style={{
            fontFamily: 'Poppins',
            fontSize: SIZES.titleFont,
            fontWeight: 700,
            color: heroText,
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {titleLine3}
        </span>
      </div>

      {/* 7. Host pill is spliced below at the END (paints on top of
           ribbon) so its base64 doesn't get inlined here. */}

      {/* 8. Laurel "Proudly hosted on Algoed" — centered horizontally
           below ribbon. Reuses the same SVG asset OG uses. */}
      <img
        src={LAUREL_BADGE}
        width={LAUREL.width}
        style={{
          position: 'absolute',
          left: LAUREL_LEFT,
          top: LAUREL.top,
        }}
      />
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: COMPETITION_IMAGE_FONTS,
    },
  )

  // ---------------------------------------------------------------------
  // SVG splicing strategy
  // ---------------------------------------------------------------------
  // Bypass Satori for heavy raster layers (bg, illustration, host-pill
  // image) so they reference CDN URLs instead of getting base64-inlined
  // into the response. Construction is plain template-literal XML;
  // attribute values from the CMS are run through `entities`'
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
  // Splice background + brand overlay + hero illustration as the first
  // children of the Satori-emitted <svg> so they paint behind everything
  // else (paint order = document order). Order: bg → overlay →
  // illustration → (Satori-rendered: tails, ribbon, title, laurel).
  // Host pill spliced at END so it paints on top of ribbon.
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
    ? `<rect x="${HOST_PILL_LEFT}" y="${HOST_PILL.top}" width="${HOST_PILL.width}" height="${HOST_PILL.height}" rx="${HOST_PILL.height / 2}" fill="white"/>` +
      `<image x="${HOST_PILL_LEFT + HOST_PILL.padding}" y="${HOST_PILL.top + HOST_PILL.padding}" width="${partnerLogoBoxW}" height="${partnerLogoBoxH}" preserveAspectRatio="xMidYMid meet" href="${escapeAttribute(partnerLogoMeta.url)}"/>`
    : ''
  const out = svg
    .replace(/^<svg [^>]*>/, (m) => `${m}${bgImage}${overlayRect}${illustrationImage}`)
    .replace(/<\/svg>$/, `${hostPill}</svg>`)

  return new Response(out, {
    headers: { 'Content-Type': 'image/svg+xml' },
  })
}
