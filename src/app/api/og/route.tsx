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
 */
import { ImageResponse } from 'next/og'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { DEFAULT_HERO_THEME } from '@/puck/theme'
import type { PuckPageData, CompetitionRootProps } from '@/puck/types'
import type { CompetitionHeroProps } from '@/components/puck/CompetitionHero.render'

const SIZE = { width: 1200, height: 630 }

// Load Baskervville Italic for audience label (matches hero font-baskervville italic underline).
// Uses fs.readFileSync instead of fetch — import.meta.url resolves to a relative /_next/static path
// which isn't fetchable in server context.
import { readFileSync } from 'fs'
import { join, basename } from 'path'
const baskervvilleItalic = readFileSync(join(process.cwd(), 'public', 'competition-assets', 'Baskervville-Italic.ttf'))
const poppinsBold = readFileSync(join(process.cwd(), 'public', 'competition-assets', 'Poppins-Bold.ttf'))

/** Resolve theme token to actual hex color. In Satori there's no CSS var context. */
function resolveColor(
  token: string,
  primaryDark: string,
  primaryBright: string,
): string {
  if (token === 'dark') return primaryDark
  if (token === 'bright') return primaryBright
  return '#ffffff'
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') ?? ''

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  const page = result.docs?.[0]
  if (!page) {
    return new ImageResponse(
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222', color: '#fff', fontSize: 48 }}>
        Page not found
      </div>,
      SIZE,
    )
  }

  const puckData = page.puckData as PuckPageData | undefined
  const rootProps: Partial<CompetitionRootProps> & Record<string, unknown> = puckData?.root?.props ?? {}

  // Brand colors
  const primaryDark = rootProps.primaryDark || '#222'
  const primaryBright = rootProps.primaryBright || primaryDark

  // Hero theme → overlay color
  const theme = rootProps.heroTheme || DEFAULT_HERO_THEME
  const [overlayToken, highlightBgToken, highlightTextToken] = theme.split('-')
  const overlayColor = resolveColor(overlayToken, primaryDark, primaryBright)
  const highlightBg = resolveColor(highlightBgToken, primaryDark, primaryBright)
  const highlightText = resolveColor(highlightTextToken, primaryDark, primaryBright)
  const oppositeOverlay = overlayToken === 'dark' ? 'bright' : 'dark'
  const heroTextStyle = rootProps.heroTextStyle || 'default'
  const heroText = heroTextStyle === 'white' ? '#ffffff'
    : heroTextStyle === 'primary' ? resolveColor(oppositeOverlay, primaryDark, primaryBright)
    : highlightBg

  // Page content — cast to actual component prop types (defined in .render.tsx files).
  const content = puckData?.content || []
  const hero = content.find((c) => c.type === 'CompetitionHero')?.props as Partial<CompetitionHeroProps> | undefined

  const titleLine1 = hero?.titleLine1 || String(rootProps.title || 'Competition')
  const titleLine2 = hero?.titleLine2 || ''
  const titleLine3 = hero?.titleLine3 || ''
  const audienceLabel = hero?.audienceLabel || ''
  // Resolve OG-sized images via Payload media API, then pre-fetch with Accept: webp
  // to trigger Cloudflare Polish compression. Satori can't set headers on its own fetches,
  // so we fetch ourselves and pass base64 data URIs.
  const resolveOgUrl = async (url: string | undefined) => {
    if (!url) return ''
    const filename = basename(new URL(url).pathname)
    const media = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      // sizes: OG variant URL. url: fallback. prefix: required by S3 plugin's
      // afterRead hook to regenerate URLs with correct folder path.
      select: { sizes: true, url: true, prefix: true },
    })
    const doc = media.docs?.[0]
    return doc?.sizes?.og?.url || url
  }
  const fetchAsDataUri = async (url: string | undefined, label: string) => {
    if (!url) return ''
    const resolved = await resolveOgUrl(url)
    try {
      // Satori can't decode webp — request PNG/JPEG only. Cloudflare Polish
      // optimizes losslessly (~33% smaller than raw R2 file). Polish won't
      // convert PNG→JPEG regardless of Accept order; only webp/avif is negotiated.
      const res = await fetch(resolved, { headers: { Accept: 'image/png,image/jpeg,image/*' } })
      if (!res.ok) { console.warn(`[og] ${label}: fetch ${res.status} for ${resolved}`); return '' }
      const contentType = res.headers.get('content-type') || 'image/png'
      const buf = await res.arrayBuffer()
      return `data:${contentType};base64,${Buffer.from(buf).toString('base64')}`
    } catch (e) { console.error(`[og] ${label}:`, e); return '' }
  }
  const heroBgUrl = await fetchAsDataUri(hero?.backgroundImage?.url, 'heroBg')
  const illustrationUrl = await fetchAsDataUri(hero?.heroImage?.url, 'illustration')
  // Partner logo removed from OG — too small, clutters the layout
  const overlayTopOpacity = Math.round((hero?.overlayTopOpacity ?? 80) * 2.55).toString(16).padStart(2, '0')
  const overlayBottomOpacity = Math.round((hero?.overlayBottomOpacity ?? 100) * 2.55).toString(16).padStart(2, '0')

  // Laurel badge as rasterized PNG (SVG was too complex for Satori's XML parser).
  // Pre-rendered at 2x (64px height) for sharpness in 1200×630 OG image.
  const badgePng = readFileSync(join(process.cwd(), 'public', 'competition-assets', 'og-proudly-hosted-badge.png'))
  const badgeBase64 = `data:image/png;base64,${badgePng.toString('base64')}`

  return new ImageResponse(
    (
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
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
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
            padding: 56, /* tw-14 */
          }}
        >
          {/* Left: text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            {/* Title — Poppins Bold, matches hero (CompetitionHero.render.tsx).
               May individually tweak later for OG-specific sizing. */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 /* tw-2.5 */ }}>
              <span style={{ fontFamily: 'Poppins', fontSize: 44, fontWeight: 700, color: heroText, textTransform: 'uppercase', lineHeight: 1.3 }}>
                {titleLine1}
              </span>
              {titleLine2 && (
                <span
                  style={{
                    display: 'flex',
                    alignSelf: 'flex-start',
                    fontFamily: 'Poppins',
                    fontSize: 44,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    lineHeight: 1.3, /* matches hero leading-[1.3] */
                    color: highlightText,
                    backgroundColor: highlightBg,
                    padding: '5px 10px', /* matches hero py-[5px] px-2.5 */
                    borderRadius: 8, /* tw rounded-lg */
                  }}
                >
                  {titleLine2}
                </span>
              )}
              <span style={{ fontFamily: 'Poppins', fontSize: 44, fontWeight: 700, color: heroText, textTransform: 'uppercase', lineHeight: 1.3 }}>
                {titleLine3}
              </span>
            </div>

            {/* Audience label — matches hero: Baskervville italic underline, heroText color. */}
            {audienceLabel && (
              <span style={{ fontFamily: 'Baskervville', fontSize: 24 /* tw text-2xl, matches hero */, color: heroText, fontStyle: 'italic', textDecoration: 'underline', marginTop: 56 /* tw-14 */ }}>
                {audienceLabel}
              </span>
            )}
          </div>

          {/* Right: illustration — right-flush, 45% of frame width per Figma */}
          {illustrationUrl ? (
            <img
              src={illustrationUrl}
              width={540}
              style={{
                position: 'absolute',
                right: 0,
                bottom: 56, /* tw-14 */
                objectFit: 'contain',
              }}
            />
          ) : null}
        </div>

        {/* Bottom: laurel badge (rasterized PNG — SVG was too complex for Satori) */}
        <div
          style={{
            position: 'absolute',
            bottom: 20, /* tw-5 */
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img src={badgeBase64} height={32} style={{ objectFit: 'contain' }} />
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        { name: 'Poppins', data: poppinsBold, weight: 700 as const, style: 'normal' as const },
        { name: 'Baskervville', data: baskervvilleItalic, weight: 400 as const, style: 'italic' as const },
      ],
    },
  )
}
