import type { ComponentData, Data } from '@puckeditor/core'
import type { PuckStateAccessors } from './get-page-state'

type Mode = 'patch' | 'overwrite'

interface UpdatePageParams {
  mode: Mode
  components: ComponentData[]
}

export function createUpdatePageTool(accessors: PuckStateAccessors) {
  return {
    name: 'update_page',
    description:
      'Updates page content in the Puck editor. Pass mode + components.\n' +
      '- **patch**: each component is matched by props.id. Props are SHALLOW-merged — top-level props merge, but arrays/objects (e.g. rounds) are fully replaced. Always pass complete values for array/object props. Components without a matching id cause an error.\n' +
      '- **overwrite**: replaces the entire content array with the provided components. Use for full page rebuilds.\n' +
      'Canvas updates live. Not saved until save_page is called.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        mode: {
          type: 'string',
          enum: ['patch', 'overwrite'],
          description: 'patch (default) = merge by id, overwrite = replace all content.',
        },
        components: {
          type: 'array',
          description: 'Array of components: [{ type: "Name", props: { id: "...", ...props } }].',
          items: { type: 'object' },
        },
      },
      required: ['components'],
    },
    execute: async (params: UpdatePageParams) => {
      const currentData = accessors.getState().data

      if (!params.components?.length) {
        return {
          content: [{ type: 'text', text: 'Error: components array is empty.' }],
          isError: true,
        }
      }

      const mode = params.mode || 'patch'

      if (mode === 'patch') {
        const content = [...(currentData.content || [])]
        const merged: string[] = []

        for (const incoming of params.components) {
          const id = incoming.props?.id
          if (!id) {
            return {
              content: [{ type: 'text', text: 'Error: every component needs props.id in patch mode.' }],
              isError: true,
            }
          }

          const idx = content.findIndex((c) => c.props?.id === id)
          if (idx === -1) {
            const ids = content.map((c) => c.props?.id).filter(Boolean)
            return {
              content: [{ type: 'text', text: `Error: no component with id "${id}". Available: ${ids.join(', ')}` }],
              isError: true,
            }
          }

          content[idx] = {
            ...content[idx],
            props: { ...content[idx].props, ...incoming.props },
          }
          merged.push(`${id} (${content[idx].type})`)
        }

        accessors.dispatch({ type: 'setData', data: { ...currentData, content } })

        return {
          content: [{ type: 'text', text: `Patched ${merged.length}: ${merged.join(', ')}. Not saved.` }],
        }
      }

      if (mode === 'overwrite') {
        const newData: Data = { ...currentData, content: params.components }
        accessors.dispatch({ type: 'setData', data: newData })

        const types = [...new Set(params.components.map((c) => c.type))]
        return {
          content: [{ type: 'text', text: `Overwrote content: ${params.components.length} components. Types: ${types.join(', ')}. Not saved.` }],
        }
      }

      return {
        content: [{ type: 'text', text: 'Error: mode must be "patch" or "overwrite".' }],
        isError: true,
      }
    },
  }
}
