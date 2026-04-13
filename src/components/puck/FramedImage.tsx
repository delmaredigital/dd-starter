'use client'

/**
 * FramedImage — client component that defers the decorative frame
 * (white border + drop shadow) until the image loads, avoiding an
 * empty bordered box during fetch. Uses plain <img>, not next/image.
 *
 * See TwoColumnFeature.render.tsx comment for why we avoid next/image.
 */
import { useState } from 'react'

const FRAME_CLS =
  'border-[10px] border-white rounded-[14px] shadow-[0_1px_17px_rgba(0,0,0,0.17)] overflow-hidden'

export function FramedImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`w-full ${loaded ? FRAME_CLS : ''}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ width: '100%', height: 'auto', borderRadius: 4 }}
      />
    </div>
  )
}
