'use client'

import { ensureWebMCP } from './polyfill'
import type { InputSchema } from '@mcp-b/webmcp-types'

export interface AgentTool {
  name: string
  description: string
  readOnly?: boolean
  inputSchema: InputSchema
  execute: (params: Record<string, unknown>) => Promise<{
    content: Array<{ type: string; text: string }>
    isError?: boolean
  }>
}

declare global {
  interface Window {
    __puckAgentTools?: AgentTool[]
  }
}

let registeredToolNames: string[] = []

export async function registerTools(tools: AgentTool[]) {
  unregisterTools()

  // 1. Expose on window (fallback for direct page.evaluate())
  window.__puckAgentTools = tools

  // 2. Mirror to navigator.modelContext (WebMCP standard path)
  await ensureWebMCP()

  const mc = navigator.modelContext
  if (mc) {
    for (const tool of tools) {
      // Defensively unregister by name first — prevents "Tool already registered"
      // crash on HMR where module state resets but polyfill state persists
      try { mc.unregisterTool(tool.name) } catch { /* not registered */ }
      mc.registerTool({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        execute: tool.execute,
        annotations: {
          readOnlyHint: tool.readOnly ?? false,
        },
      })
      registeredToolNames.push(tool.name)
    }
  }
}

export function unregisterTools() {
  const mc = navigator.modelContext
  if (mc) {
    for (const name of registeredToolNames) {
      try {
        mc.unregisterTool(name)
      } catch {
        // Tool may already be unregistered
      }
    }
  }
  registeredToolNames = []

  delete window.__puckAgentTools
}
