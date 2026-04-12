'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { prepareWithSegments } from '@chenglou/pretext'
import { breakLines, positionItems, forcedBreak, type InputItem } from 'tex-linebreak'

// Pretext (measurement) + tex-linebreak (Knuth-Plass optimal breaking)
// + CSS text-align: justify (word spacing).
//
// prepareWithSegments gives .segments[] and .widths[] — per-word pixel
// widths measured via canvas without DOM reflow. Those widths feed into
// tex-linebreak as box/glue/penalty items for optimal line breaking.
// Each resulting line renders as a block <span> with CSS justify.

// tex-linebreak defaults: stretch 1.5×, shrink 0.6× of space width
const SPACE_STRETCH = 1.5
const SPACE_SHRINK = 0.6

type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; html: string }

function splitIntoBlocks(html: string): Block[] {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const blocks: Block[] = []
  for (const el of doc.body.children) {
    const tag = el.tagName.toLowerCase()
    if (tag === 'ul' || tag === 'ol') {
      blocks.push({ type: 'list', html: el.outerHTML })
    } else {
      const text = el.textContent?.trim()
      if (text) blocks.push({ type: 'p', text })
    }
  }
  if (blocks.length === 0) {
    const text = doc.body.textContent?.trim()
    if (text) blocks.push({ type: 'p', text })
  }
  return blocks
}

function segmentsToItems(
  segments: readonly string[],
  widths: readonly number[],
): InputItem[] {
  const items: InputItem[] = []
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]!
    const w = widths[i]!
    if (seg.trim().length === 0) {
      items.push({
        type: 'glue',
        width: w,
        stretch: w * SPACE_STRETCH,
        shrink: w * SPACE_SHRINK,
      })
    } else {
      items.push({ type: 'box', width: w })
    }
  }
  items.push(forcedBreak())
  return items
}

function JustifiedParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<string[] | null>(null)

  const reflow = useCallback(async () => {
    if (!ref.current) return
    await document.fonts.ready
    const width = ref.current.offsetWidth
    if (width <= 0) return

    try {
      const styles = getComputedStyle(ref.current)
      const font = styles.font || `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`
      const prepared = prepareWithSegments(text, font)
      const items = segmentsToItems(prepared.segments, prepared.widths)
      const breakpoints = breakLines(items, width, { maxAdjustmentRatio: null })
      const positions = positionItems(items, width, breakpoints, { includeGlue: true })

      const lineMap = new Map<number, string[]>()
      for (const pos of positions) {
        const seg = prepared.segments[pos.item]
        if (seg == null) continue
        if (!lineMap.has(pos.line)) lineMap.set(pos.line, [])
        lineMap.get(pos.line)!.push(seg)
      }

      const result: string[] = []
      for (const [, words] of [...lineMap.entries()].sort((a, b) => a[0] - b[0])) {
        result.push(words.join(''))
      }
      setLines(result)
    } catch {
      setLines(null)
    }
  }, [text])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(() => reflow())
    observer.observe(el)
    return () => observer.disconnect()
  }, [reflow])

  if (!lines) {
    return (
      <p ref={ref} className="text-justify mb-4">
        {text}
      </p>
    )
  }

  return (
    <div ref={ref} className="mb-4">
      {lines.map((line, i) => (
        <span
          key={i}
          className={`block ${i < lines.length - 1 ? 'text-justify' : 'text-left'}`}
        >
          {line}
        </span>
      ))}
    </div>
  )
}

export function PretextRichText({
  html,
  className,
}: {
  html: string
  className?: string
}) {
  if (!html) return null
  const blocks = splitIntoBlocks(html)

  return (
    <div className={`prose prose-sm max-w-none ${className ?? ''}`}>
      {blocks.map((block, i) =>
        block.type === 'list'
          ? <div key={i} dangerouslySetInnerHTML={{ __html: block.html }} />
          : <JustifiedParagraph key={i} text={block.text} />
      )}
    </div>
  )
}
