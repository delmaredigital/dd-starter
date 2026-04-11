/**
 * Strip Vary header complexity from Payload media file responses.
 *
 * Cloudflare Polish (and similar CDN image optimizers) only process image
 * responses whose `Vary` header is exactly `Accept-Encoding` or absent.
 * Any other value — for any reason — makes Polish skip the response with
 * `cf-polished: vary_header_present`, blocking all automatic image
 * optimization site-wide.
 *
 * Two sources of problematic Vary headers on our media routes:
 *   1. @payloadcms/next's withPayload wrapper injects
 *      `Vary: Sec-CH-Prefers-Color-Scheme` globally for admin dark-mode
 *      detection. We already scope this to admin paths in next.config.ts,
 *      but that only works for header rules we can intercept at config time.
 *   2. Next.js App Router adds its own Vary headers
 *      (`rsc, next-router-state-tree, next-router-prefetch, ...`) to all
 *      responses, including images. These come from Next.js internals and
 *      can't be stripped via next.config.ts because they're added after
 *      config runs.
 *
 * This middleware overrides the Vary header to `Accept-Encoding` only for
 * `/api/media/file/*` responses. Polish then accepts them and auto-optimizes
 * every PNG/JPG on the site into WebP/AVIF for supporting browsers.
 *
 * Scope: media file responses only. Admin, frontend pages, and API routes
 * are untouched.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_req: NextRequest) {
  const res = NextResponse.next()
  res.headers.set('Vary', 'Accept-Encoding')
  return res
}

export const config = {
  matcher: '/api/media/file/:path*',
}
