/**
 * FramedImage — decorative frame (white border + drop shadow) around
 * an image. Server-rendered — no client state needed. The frame is
 * always present; the img width/height attributes reserve space so
 * the frame never wraps a 0×0 box.
 */

const FRAME_CLS =
  'border-[10px] border-white rounded-[14px] shadow-[0_1px_17px_rgba(0,0,0,0.17)] overflow-hidden'

export function FramedImage({ src, alt, width, height }: { src: string; alt: string; width?: number; height?: number }) {
  return (
    <div className={`w-full ${FRAME_CLS}`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ width: '100%', height: 'auto', borderRadius: 4 }}
      />
    </div>
  )
}
