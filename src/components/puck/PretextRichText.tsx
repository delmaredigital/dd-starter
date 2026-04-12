'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { layoutItemsFromString, breakLines, positionItems } from 'tex-linebreak'

// Knuth-Plass justified text via tex-linebreak.
// DOM-based measurement (hidden span + getBoundingClientRect) for
// pixel-accurate width matching with browser rendering. Runs once
// per paragraph, re-runs on resize.
//
// Pretext (installed separately) is reserved for future use cases
// like variable-width layouts around images.

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

function computedFont(cs: CSSStyleDeclaration): string {
  return [cs.fontStyle, cs.fontVariant, cs.fontWeight,
    `${cs.fontSize}/${cs.lineHeight}`, cs.fontFamily].filter(Boolean).join(' ')
}

function contentBoxWidth(el: HTMLElement, cs: CSSStyleDeclaration): number {
  return el.getBoundingClientRect().width
    - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
    - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth)
}

function createMeasurer(el: HTMLElement) {
  const span = document.createElement('span')
  span.style.visibility = 'hidden'
  span.style.position = 'absolute'
  span.style.whiteSpace = 'pre'
  span.style.font = computedFont(getComputedStyle(el))
  document.body.appendChild(span)
  return {
    measure(word: string) {
      span.textContent = word
      return span.getBoundingClientRect().width
    },
    cleanup() { span.remove() },
  }
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

    const { measure, cleanup } = createMeasurer(ref.current)
    try {
      const items = layoutItemsFromString(text, measure)
      const breakpoints = breakLines(items, width, { maxAdjustmentRatio: null })
      const positions = positionItems(items, width, breakpoints, { includeGlue: true })

      const lineMap = new Map<number, string[]>()
      for (const pos of positions) {
        const item = items[pos.item]
        if (item && 'text' in item && item.text) {
          if (!lineMap.has(pos.line)) lineMap.set(pos.line, [])
          lineMap.get(pos.line)!.push(item.text)
        }
      }

      const result: string[] = []
      for (const [, words] of [...lineMap.entries()].sort((a, b) => a[0] - b[0])) {
        result.push(words.join(''))
      }
      setLines(result)
    } catch {
      setLines(null)
    } finally {
      cleanup()
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
