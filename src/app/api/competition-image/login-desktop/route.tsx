/**
 * Dynamic login-banner image generator (desktop variant).
 * Serves at /api/competition-image/login-desktop?slug=<slug>.
 *
 * Consumed by the Angular student-app split-pane login screen as the tall
 * left-side panel; admin pastes this URL into `CompetitionEvents.login_image_desktop`
 * to override any manually-uploaded PNG.
 *
 * Output: SVG (text/xml). All consumers are internal (our Angular apps) so
 * no rasterization is needed; the browser scales SVG to any pixel size.
 *
 * Layout: 1392×2560 portrait. Vertical stack — host logo pill above the
 * title ribbon, hero illustration above the pill (overlapping), red brand
 * overlay over the campus photo, ribbon tails on either side, "Proudly
 * hosted on Algoed" laurel below the ribbon.
 *
 * Sizing: titleFont = 62px per Figma. Highlight pill padding, title gap,
 * and pill border-radius come from `deriveSizes(62)` so they scale
 * consistently with OG (calibrated at 60).
 */
import satori from 'satori'
import { hexDarken } from '@/components/puck/shared'
import { COMPETITION_IMAGE_FONTS } from '@/lib/competition-image/fonts'
import { LAUREL_BADGE } from '@/lib/competition-image/assets'
import { loadCompetitionImageData } from '@/lib/competition-image/loader'
import { deriveSizes } from '@/lib/competition-image/proportions'

// Three-tier red layering — tail body (brightest) → ribbon body (mid) →
// tail fold-shadow (darkest). All derived from the same overlay color so
// they shift together per theme. Geometric-mean ratio: each step ~29%
// darker than the prior, giving visible separation between all three
// layers at any brand color.
const SHADOW_DARKEN = 0.5
const RIBBON_DARKEN = Math.sqrt(SHADOW_DARKEN) /* ≈ 0.7071, geometric mean of 1 and SHADOW_DARKEN */

// Ribbon tail shape — inline so the fill is theme-driven. Body uses the
// hero overlay color (matches the photo-tint band on the canvas); the
// triangular fold at the corner uses a darker shade of the same color to
// sell the "tucked behind" depth illusion. viewBox keeps the asset's
// intrinsic 167:229 aspect; Satori scales width-only and computes height.
function RibbonTail({
  bodyColor,
  width,
  left,
  top,
  flip = false,
}: {
  bodyColor: string
  width: number
  left: number
  top: number
  flip?: boolean
}) {
  return (
    <svg
      width={width}
      viewBox="0 0 167 229"
      style={{
        position: 'absolute',
        left,
        top,
        ...(flip ? { transform: 'scaleX(-1)' } : {}),
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

// Canvas is the SVG unit space — design coordinates, not output pixels.
// Browser scales the SVG to whatever container size it lands in.
const WIDTH = 1392
const HEIGHT = 2560
const SIZES = deriveSizes(62)

// Element dimensions and y positions are expressed as fractions of canvas
// width / height (Figma desktop frame, node 6519:19576). This makes the
// design intent canvas-agnostic — bumping WIDTH/HEIGHT later (or porting
// the layout to a different aspect) propagates through every primitive
// without touching layout literals one by one.
const w = (frac: number) => Math.round(frac * WIDTH)
const h = (frac: number) => Math.round(frac * HEIGHT)

// Hero illustration — width-only constraint at ~60% canvas. Height comes
// from the asset's intrinsic aspect (Satori reads it from the PNG/SVG
// source the same way a browser would). Anchored by *bottom* (not top) so
// the illustration's bottom edge meets the ribbon's top edge regardless
// of asset aspect; the top floats per-asset.
const ILLUSTRATION = {
  width: w(835 / 1392),
}
const HOST_PILL = {
  top: h(1170 / 2560),
  width: w(340 / 1392),
  height: h(106 / 2560),
  padding: h(17.5 / 2560), // uniform inset for the partner logo inside the pill
}
const RIBBON = {
  top: h(1240 / 2560),
  width: w(1120 / 1392),
  height: h(366 / 2560),
}

// Vector assets — only width specified; Satori reads the SVG viewBox and
// scales height proportionally (same behavior OG uses for the laurel).
const TAIL_WIDTH = w(167 / 1392)
const LAUREL = {
  top: h(1717 / 2560),
  width: w(1044 / 1392) /* 75% canvas; Figma's 815 ≈ 58% read too small */,
}

// Tail-to-ribbon overlap, also expressed as canvas-width fractions so
// scaling the canvas keeps the visual relationship intact.
const TAIL_OUTSET = w(93 / 1392) // tail protrudes this far outside ribbon
const TAIL_TOP_OFFSET = h(186 / 2560) // tail top sits this far below ribbon top

// Relationships
const RIBBON_LEFT = (WIDTH - RIBBON.width) / 2 // ribbon centered horizontally
const TAIL_INSET = TAIL_WIDTH - TAIL_OUTSET // tail tucks this far behind ribbon
const TAIL_TOP = RIBBON.top + TAIL_TOP_OFFSET
const LEFT_TAIL_LEFT = RIBBON_LEFT - TAIL_OUTSET
const RIGHT_TAIL_LEFT = RIBBON_LEFT + RIBBON.width - TAIL_INSET
const HOST_PILL_LEFT = (WIDTH - HOST_PILL.width) / 2
const ILLUSTRATION_LEFT = (WIDTH - ILLUSTRATION.width) / 2
const LAUREL_LEFT = (WIDTH - LAUREL.width) / 2

// Title block placement inside the ribbon. Padding-top derives from
// "title-line-1 cy 1331 minus ~half line-height" relative to ribbon top.
const RIBBON_PADDING_TOP = h(50 / 2560)
const RIBBON_GAP = SIZES.titleGap

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') ?? ''

  console.log(`[competition-image] login-desktop: rendering slug=${slug}`)

  const data = await loadCompetitionImageData(slug)
  if (!data) {
    return new Response('Page not found', { status: 404 })
  }

  const { hero, partnerLogo, colors, resolveImageMeta } = data
  const { overlayColor, highlightBg, highlightText, heroText } = colors
  const ribbonBody = hexDarken(overlayColor, RIBBON_DARKEN)

  const titleLine1 = hero?.titleLine1 || 'Competition'
  const titleLine2 = hero?.titleLine2 || ''
  const titleLine3 = hero?.titleLine3 || ''

  // Resolve URLs + intrinsic dimensions (no fetching). The output SVG
  // references each image via `<image href>` so the browser fetches them
  // at render time — keeps the response payload tiny and lets Cloudflare
  // Polish negotiate webp/avif transparently per client.
  const [heroBgMeta, illustrationMeta, partnerLogoMeta] = await Promise.all([
    resolveImageMeta(hero?.backgroundImage?.url, 'xlarge'),
    resolveImageMeta(hero?.heroImage?.url, 'xlarge'),
    resolveImageMeta(partnerLogo?.url, 'medium'),
  ])

  // SVG `<image>` needs explicit width *and* height. Compute height from
  // the source's intrinsic aspect so width remains the design knob.
  const illustrationHeight = illustrationMeta
    ? Math.round((ILLUSTRATION.width * illustrationMeta.height) / illustrationMeta.width)
    : 0
  const partnerLogoBoxW = HOST_PILL.width - 2 * HOST_PILL.padding
  const partnerLogoBoxH = HOST_PILL.height - 2 * HOST_PILL.padding

  // Photo overlay — flat 90% alpha, sourced from Figma desktop frame
  // (rgba(154,0,0,0.9) = brand red at 0.9). Hex E6 = round(0.9 × 255).
  // OG's gradient using hero.overlayTopOpacity/BottomOpacity is intentionally
  // not used here — Figma specs a uniform overlay for this template.
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
      {/* 1. Background photo (full bleed). preserveAspectRatio=slice gives
           CSS object-fit:cover semantics in SVG. CSS width/height duplicates
           the SVG attribute so Satori's layout sees the box dimensions. */}
      {heroBgMeta ? (
        <svg
          width={WIDTH}
          height={HEIGHT}
          style={{ position: 'absolute', top: 0, left: 0, width: WIDTH, height: HEIGHT }}
        >
          <image
            href={heroBgMeta.url}
            width={WIDTH}
            height={HEIGHT}
            preserveAspectRatio="xMidYMid slice"
          />
        </svg>
      ) : null}

      {/* 2. Brand overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: WIDTH,
          height: HEIGHT,
          background: heroBgMeta ? overlayFill : overlayColor,
        }}
      />

      {/* 3. Hero illustration (composite asset; decorative icons + landmark
           are baked into this PNG, no separate elements). Sits behind the
           host logo pill which overlaps it from below. Anchored by bottom
           so its lower edge always meets the ribbon top regardless of
           per-asset aspect. */}
      {illustrationMeta ? (
        <svg
          width={ILLUSTRATION.width}
          height={illustrationHeight}
          style={{
            position: 'absolute',
            left: ILLUSTRATION_LEFT,
            bottom: HEIGHT - RIBBON.top,
            width: ILLUSTRATION.width,
            height: illustrationHeight,
          }}
        >
          <image
            href={illustrationMeta.url}
            width={ILLUSTRATION.width}
            height={illustrationHeight}
          />
        </svg>
      ) : null}

      {/* 4. Left ribbon tail (renders before ribbon so its right edge tucks
           behind the ribbon body — Satori has no z-index, paint order = DOM
           order). Body matches the hero overlay color. */}
      <RibbonTail
        bodyColor={overlayColor}
        width={TAIL_WIDTH}
        left={LEFT_TAIL_LEFT}
        top={TAIL_TOP}
      />

      {/* 5. Right ribbon tail (mirrored) */}
      <RibbonTail
        bodyColor={overlayColor}
        width={TAIL_WIDTH}
        left={RIGHT_TAIL_LEFT}
        top={TAIL_TOP}
        flip
      />

      {/* 6. Central title ribbon — geometric-mean darken of overlayColor,
           sitting between the tail body and the fold shadow so all three
           red layers read as a coherent depth stack. Holds three title
           lines stacked. */}
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

      {/* 7. Host logo pill — white rounded rectangle on top of the ribbon
           top edge. Hide when no partnerLogo is set. */}
      {partnerLogoMeta ? (
        <div
          style={{
            position: 'absolute',
            left: HOST_PILL_LEFT,
            top: HOST_PILL.top,
            width: HOST_PILL.width,
            height: HOST_PILL.height,
            background: '#ffffff',
            borderRadius: 9999 /* CSS auto-caps to half the smaller dimension; this idiom always pills */,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width={partnerLogoBoxW}
            height={partnerLogoBoxH}
            style={{ width: partnerLogoBoxW, height: partnerLogoBoxH }}
          >
            <image
              href={partnerLogoMeta.url}
              width={partnerLogoBoxW}
              height={partnerLogoBoxH}
              preserveAspectRatio="xMidYMid meet"
            />
          </svg>
        </div>
      ) : null}

      {/* 8. Laurel "Proudly hosted on Algoed" — centered horizontally below
           ribbon. Reuses the same SVG asset OG uses. */}
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

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' },
  })
}
