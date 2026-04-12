'use client'

/**
 * WebMCP runtime — imports @mcp-b/global which:
 * 1. Polyfills navigator.modelContext
 * 2. Sets up MCP bridge transport (iframe/tab)
 * Side-effect import — auto-initializes on load.
 */

let initialized = false

export function ensureWebMCP() {
  if (!initialized && typeof window !== 'undefined') {
    import('@mcp-b/global')
    initialized = true
  }
}
