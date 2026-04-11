'use client'
/**
 * FramedPayloadImage — client variant of PayloadImage that defers the
 * decorative frame (white border + drop shadow) until onLoad fires, so
 * the reserved-but-empty bordered box isn't visible during fetch.
 *
 * Blur placeholder: see TODO(blur-placeholder) in PayloadImage.tsx.
 */
import Image from 'next/image'
import { useState } from 'react'
import type { MediaReference } from '@delmaredigital/payload-puck/fields'

const FRAME_CLS =
  'border-[10px] border-white rounded-[14px] shadow-[0_1px_17px_rgba(0,0,0,0.17)] overflow-hidden'

export function FramedPayloadImage({
  media,
  alt,
  sizes = '(max-width: 940px) 100vw, 940px',
}: {
  media: MediaReference | null | undefined
  alt?: string
  sizes?: string
}) {
  const [loaded, setLoaded] = useState(false)

  // No cached-image polyfill needed: next/image's internal ref callback
  // checks `img.complete` after attach and fires onLoad for us. See
  // node_modules/next/dist/client/image-component.js handleLoading().
  if (!media?.url || !media.width || !media.height) return null

  const resolvedAlt = alt ?? media.alt ?? ''

  // Inner image border-radius = 4, NOT 14 (even though Figma exports 14).
  //
  // Parent has `border: 10 solid white; border-radius: 14; overflow-hidden`.
  // CSS spec: the inner curve where content meets the border has radius
  //   inner = max(0, outerRadius − borderWidth) = 14 − 10 = 4.
  // Parent's overflow-hidden clips children at that 4-curve inside a 4×4
  // corner square. Beyond the corner square, the inner area is rectangular.
  //
  // • Child radius 4  → image rounds to match the inner curve exactly.
  //                     Zero transparent pixels. Seamless.
  // • Child radius 14 → image rounds itself at 14, creating transparent
  //                     pixels in the 4–14 annular region at each corner
  //                     where the parent doesn't clip but the image is
  //                     rounded away. Parent bg bleeds through.
  //
  // Figma's `get_design_context` exports `rounded-[14px]` because it
  // serializes the image node's own `cornerRadius` property literally.
  // Figma's *rendered* pixels look identical to the r4 case at normal
  // display size (the 4-vs-14 bite is sub-perceptible at 419×328), so
  // Figma's own thumbnail doesn't disambiguate. Verified via standalone
  // browser experiment (magenta parent bg, 4× corner zoom) — the r14
  // case has a real pixel-level bleed, r4 is clean. See
  // feedback_css_visual_debug.md in memory.
  //
  // Keep at 4. Do not "fix" to 14 based on reading Figma's export.
  // `w-full` on the wrapper matters: inside a shrink-to-fit flex
  // parent, the Image's `width: 100%` would otherwise resolve
  // circularly to intrinsic width.
  return (
    <div className={`w-full ${loaded ? FRAME_CLS : ''}`}>
      <Image
        src={media.url}
        alt={resolvedAlt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        // `width: 100%` (not `maxWidth`) — framed cards are designed to
        // fill their column; the frame is the point. Differs from
        // PayloadImage's plain mode which preserves intrinsic size.
        // `borderRadius: 4` matches the parent's CSS inner curve (see
        // long note above).
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: 4,
        }}
      />
    </div>
  )
}
