'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { prepareWithSegments } from '@chenglou/pretext'
import { breakLines, positionItems, forcedBreak, type InputItem } from 'tex-linebreak'

// Two-stage justified text:
//   Stage 1: Pretext (canvas measurement) + tex-linebreak (Knuth-Plass)
//            → fast candidate line breaks
//   Stage 2: DOM validation per line → shave last word if line overflows
//   Rendering: CSS text-align: justify + text-align-last handles spacing

const SPACE_STRETCH = 1.5
const SPACE_SHRINK = 0.6

type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; html: string }

function splitIntoBlocks(html: string): Block[] {
  if (typeof DOMParser === 'undefined') {
    return [{ type: 'p', text: html.replace(/<[^>]+>/g, '') }]
  }
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
      items.push({ type: 'glue', width: w, stretch: w * SPACE_STRETCH, shrink: w * SPACE_SHRINK })
    } else {
      items.push({ type: 'box', width: w })
    }
  }
  items.push(forcedBreak())
  return items
}

function proposeCandidateLines(text: string, width: number, font: string): string[][] {
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

  return [...lineMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, segs]) => segs)
}

function validateLines(candidates: string[][], width: number, span: HTMLSpanElement): string[] {
  const validated: string[] = []
  let carry: string[] = []

  for (let i = 0; i < candidates.length; i++) {
    const segs = [...carry, ...candidates[i]!]
    carry = []

    span.textContent = segs.join('').trim()

    if (span.getBoundingClientRect().width <= width || i === candidates.length - 1) {
      validated.push(segs.join(''))
    } else {
      while (segs.length > 1) {
        carry.unshift(segs.pop()!)
        span.textContent = segs.join('').trim()
        if (span.getBoundingClientRect().width <= width) break
      }
      validated.push(segs.join(''))
    }
  }

  return validated
}

function contentBoxWidth(el: HTMLElement, cs: CSSStyleDeclaration): number {
  return el.getBoundingClientRect().width
    - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
    - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth)
}

function computedFont(cs: CSSStyleDeclaration): string {
  return [cs.fontStyle, cs.fontVariant, cs.fontWeight,
    `${cs.fontSize}/${cs.lineHeight}`, cs.fontFamily].filter(Boolean).join(' ')
}

function JustifiedParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [lines, setLines] = useState<string[] | null>(null)

  const reflow = useCallback(async () => {
    if (!ref.current) return
    await document.fonts.ready
    const cs = getComputedStyle(ref.current)
    const width = contentBoxWidth(ref.current, cs)
    if (width <= 0) return

    const span = document.createElement('span')
    span.style.visibility = 'hidden'
    span.style.position = 'absolute'
    span.style.whiteSpace = 'pre'
    ref.current.appendChild(span)

    try {
      const font = computedFont(cs)
      const candidates = proposeCandidateLines(text, width, font)
      const validated = validateLines(candidates, width, span)
      setLines(validated)
    } catch {
      setLines(null)
    } finally {
      span.remove()
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
      <p ref={ref} className="text-justify">
        {text}
      </p>
    )
  }

  return (
    <p ref={ref}>
      {lines.map((line, i) => (
        <span
          key={i}
          className="block text-justify"
          style={i < lines.length - 1 ? { textAlignLast: 'justify' } : { textAlignLast: 'left' }}
        >
          {line}
        </span>
      ))}
    </p>
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
