'use client'
import { Component, type ReactNode } from 'react'

/**
 * Error boundary for Puck's RichTextRender.
 * Catches TipTap/ProseMirror crashes (e.g. "Empty text nodes are not allowed"
 * when richtext field content is an empty string) and renders nothing instead
 * of crashing the entire page.
 */
export class RichTextBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}
