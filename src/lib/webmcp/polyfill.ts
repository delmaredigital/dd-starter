'use client'

/**
 * WebMCP runtime — imports @mcp-b/global which:
 * 1. Polyfills navigator.modelContext
 * 2. Sets up MCP bridge transport (iframe/tab)
 */

let initPromise: Promise<void> | null = null

export function ensureWebMCP(): Promise<void> {
  if (!initPromise && typeof window !== 'undefined') {
    initPromise = import('@mcp-b/global').then(() => {})
  }
  return initPromise || Promise.resolve()
}
