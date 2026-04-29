/**
 * Dynamic Open Graph image generator for competition pages.
 * Serves at /api/og?slug=<slug> — referenced from generateMetadata in [...slug]/page.tsx.
 *
 * Moved from colocated opengraph-image.tsx because Next.js doesn't support
 * metadata file conventions under catch-all routes ([...slug]).
 * See: https://github.com/vercel/next.js/issues/56963
 *
 * Layout: hero bg + brand overlay → title block (left) → illustration (right) → laurel badge (bottom center)
 * Size: 1200×630 (standard OG)
 *
 * Shared loader, fonts, and assets live in `src/lib/competition-image/` so
 * sibling templates (login-desktop, …) can reuse the Payload lookup, theme
 * resolution, and image-as-data-URI plumbing without copy-paste drift.
 */
import { ImageResponse } from 'next/og'
import { COMPETITION_IMAGE_FONTS } from '@/lib/competition-image/fonts'
import { LAUREL_BADGE } from '@/lib/competition-image/assets'
import { loadCompetitionImageData } from '@/lib/competition-image/loader'

const SIZE = { width: 1200, height: 630 }

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') ?? ''

  console.log(`[competition-image] og: rendering slug=${slug}`)

  const data = await loadCompetitionImageData(slug)
  if (!data) {
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#222',
          color: '#fff',
          fontSize: 48,
        }}
      >
        Page not found
      </div>,
      SIZE,
    )
  }

  const { rootProps, hero, colors, fetchAsDataUri } = data
  const { overlayColor, highlightBg, highlightText, heroText } = colors

  const titleLine1 = hero?.titleLine1 || rootProps?.title || 'Competition'
  const titleLine2 = hero?.titleLine2 || ''
  const titleLine3 = hero?.titleLine3 || ''
  const audienceLabel = hero?.audienceLabel || ''

  const heroBgUrl = await fetchAsDataUri(hero?.backgroundImage?.url, 'heroBg')
  const illustrationUrl = await fetchAsDataUri(hero?.heroImage?.url, 'illustration')
  // Partner logo removed from OG — too small, clutters the layout
  const overlayTopOpacity = Math.round((hero?.overlayTopOpacity ?? 80) * 2.55)
    .toString(16)
    .padStart(2, '0')
  const overlayBottomOpacity = Math.round((hero?.overlayBottomOpacity ?? 100) * 2.55)
    .toString(16)
    .padStart(2, '0')

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        /* no fontFamily — Satori uses built-in Noto Sans. Baskervville only on audience label. */
      }}
    >
      {/* Background: hero photo or solid color */}
      {heroBgUrl ? (
        <img
          src={heroBgUrl}
          width={1200}
          height={630}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : null}

      {/* Brand overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: heroBgUrl
            ? `linear-gradient(${overlayColor}${overlayTopOpacity}, ${overlayColor}${overlayBottomOpacity})`
            : overlayColor,
        }}
      />

      {/* Content layer — spacings derived from Figma OG card (250×145 → 1200×630) */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: 52 /* tw-13, ratio-matched to Figma OG card */,
        }}
      >
        {/* Illustration first in DOM — Satori has no z-index, later elements paint on top.
             Text must come after so it covers the illustration (same as hero's z-10 vs z-0). */}
        {illustrationUrl ? (
          <img
            src={illustrationUrl}
            style={{
              position: 'absolute',
              right: 0,
              bottom: 52 /* tw-13, matches content padding */,
              width: '45%',
              maxHeight: '50%',
              objectFit: 'contain',
            }}
          />
        ) : null}

        {/* Left: text + badge column — space-between distributes gaps
             equally between title, audience, and badge as content allows.
             Alternatives considered:
             - Fixed title→audience gap (audience glued as subtitle, auto gap
               below): semantically cleaner but competes for space with badge
               and may overlap under long titles.
             - Proportional gap (e.g. 2:1 top:bottom via flex spacers): more
               tuning, marginal visual benefit given tight OG card height.
             - Fit-to-height (scale text/layout): true solution but requires
               two-step Satori → SVG → resvg pipeline; too much machinery
               for current content range.
             space-between is simplest, overlap-proof, acceptable in 630px. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
          }}
        >
          {/* Title — Poppins Bold, matches hero (CompetitionHero.render.tsx).
               May individually tweak later for OG-specific sizing. */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16 /* tw-4, simulates Figma's mixed 1.3/1.55 line heights at uniform 1.2 */,
            }}
          >
            <span
              style={{
                fontFamily: 'Poppins',
                fontSize: 60,
                /* tw text-6xl */ fontWeight: 700,
                color: heroText,
                textTransform: 'uppercase',
              }}
            >
              {titleLine1}
            </span>
            {titleLine2 && (
              <span
                style={{
                  display: 'flex',
                  alignSelf: 'flex-start',
                  fontFamily: 'Poppins',
                  fontSize: 60 /* tw text-6xl */,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  /* lineHeight: default 1.2 — gap: 16 simulates Figma's 1.55 on highlight */
                  color: highlightText,
                  backgroundColor: highlightBg,
                  padding: '6px 12px' /* scaled from hero py-[5px] px-2.5 at 60px */,
                  borderRadius: 12 /* tw rounded-xl */,
                }}
              >
                {titleLine2}
              </span>
            )}
            <span
              style={{
                fontFamily: 'Poppins',
                fontSize: 60,
                /* tw text-6xl */ fontWeight: 700,
                color: heroText,
                textTransform: 'uppercase',
              }}
            >
              {titleLine3}
            </span>
          </div>

          {/* Audience label — matches hero: Baskervville italic underline, heroText color. */}
          {audienceLabel && (
            <span
              style={{
                fontFamily: 'Baskervville',
                fontSize: 30 /* tw text-3xl, 0.5× title */,
                color: heroText,
                fontStyle: 'italic',
                textDecoration: 'underline',
              }}
            >
              {audienceLabel}
            </span>
          )}

          {/* Laurel badge — in-flow as 3rd child so space-between distributes
               gaps equally among title, audience, badge. No overlap with text
               above — layout is flow-aware. marginBottom: -32 preserves the
               original absolute-positioned bottom (y=610) by offsetting from
               the flex-default position (y=578, = 630 canvas - 52 padding). */}
          <img src={LAUREL_BADGE} width={548} style={{ marginBottom: -32 }} />
        </div>
      </div>
    </div>,
    {
      ...SIZE,
      fonts: COMPETITION_IMAGE_FONTS,
    },
  )
}
