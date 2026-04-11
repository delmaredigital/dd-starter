/**
 * PayloadImage — shared next/image wrapper for Payload MediaReference.
 * Server-safe (no event handlers). Next 16 conventions: width/height
 * default, fill opt-in, no `priority` (deprecated), relative
 * `/api/media/...` URLs, default `sizes` tuned for the 940px container.
 *
 * TODO(blur-placeholder): add low-quality image placeholder support.
 *   1. Payload Media collection: add `blurDataURL: string` field.
 *   2. Media upload hook: generate ~20px base64 blur via plaiceholder or
 *      sharp.resize().blur() → write to blurDataURL. Skip SVG/tiny files.
 *   3. One-off migration script: backfill blurDataURL for existing records.
 *   4. Here: read media.blurDataURL, pass placeholder="blur" + blurDataURL
 *      to <Image>. Same path in FramedPayloadImage.
 * Until step 2 exists, placeholder stays "empty"; layout reservation
 * (width/height) is the only loading UX.
 */
import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { MediaReference } from '@delmaredigital/payload-puck/fields'

type CommonProps = {
  media: MediaReference | null | undefined
  alt?: string
  className?: string
  sizes?: string
  preload?: boolean
  fetchPriority?: 'high' | 'low' | 'auto'
  loading?: 'eager' | 'lazy'
}

type FillProps = CommonProps & {
  fill: true
  style?: CSSProperties
}

type IntrinsicProps = CommonProps & {
  fill?: false
  style?: CSSProperties
}

export type PayloadImageProps = FillProps | IntrinsicProps

export const DEFAULT_PAYLOAD_IMAGE_SIZES = '(max-width: 940px) 100vw, 940px'

export function PayloadImage(props: PayloadImageProps) {
  const {
    media,
    alt,
    className,
    sizes = DEFAULT_PAYLOAD_IMAGE_SIZES,
    preload,
    fetchPriority,
    loading,
    style,
  } = props

  if (!media?.url) return null

  const resolvedAlt = alt ?? media.alt ?? ''

  const shared = {
    src: media.url,
    alt: resolvedAlt,
    className,
    sizes,
    preload,
    fetchPriority,
    loading,
  }

  if (props.fill) {
    return <Image {...shared} fill style={style} />
  }

  if (!media.width || !media.height) return null

  // `maxWidth: 100%` not `width: 100%`: preserves intrinsic size and only
  // caps at container width. Matches the legacy `<img className="max-w-full
  // h-auto">` behavior so small uploads don't get stretched blurry.
  return (
    <Image
      {...shared}
      width={media.width}
      height={media.height}
      style={{ maxWidth: '100%', height: 'auto', ...style }}
    />
  )
}
