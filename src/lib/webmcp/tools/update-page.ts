import type { Data } from '@puckeditor/core'
import type { PuckStateAccessors } from './get-page-state'

export function createUpdatePageTool(accessors: PuckStateAccessors) {
  return {
    name: 'update_page',
    description:
      'Replaces the entire page content in the Puck editor. Takes a complete puckData object with root, content, and optionally zones. The editor canvas updates immediately — the human sees the change live. Call get_page_state first to see current state, get_component_schema to understand valid components and props. The page is NOT saved/published — call save_page after. Gotcha: Image components need aspectRatio: "auto" unless parent has explicit height — other values use absolute positioning and collapse to zero height.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        puckData: {
          type: 'object',
          description:
            'Complete Puck Data object. Structure: { root: { props: { title, pageLayout, ... } }, content: [ { type: "ComponentName", props: { id: "unique-id", ...componentProps } } ], zones?: { "zoneName": [...] } }',
        },
      },
      required: ['puckData'],
    },
    execute: async (params: { puckData: Data }) => {
      const previousState = accessors.getState()
      const previousCount = (previousState.data.content || []).length

      accessors.dispatch({ type: 'setData', data: params.puckData })

      const newCount = (params.puckData.content || []).length
      const newTypes = (params.puckData.content || []).map((c) => c.type)

      return {
        content: [
          {
            type: 'text',
            text: `Page updated. Content: ${previousCount} → ${newCount} components. Types: ${[...new Set(newTypes)].join(', ')}. The editor canvas has been updated — changes are visible but NOT saved yet.`,
          },
        ],
      }
    },
  }
}
