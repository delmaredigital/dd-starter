import deepMerge from '@/utilities/deepMerge'
import type { PuckStateAccessors } from './get-page-state'

export function createUpdateRootPropsTool(accessors: PuckStateAccessors) {
  return {
    name: 'update_root_props',
    description:
      'Updates page-level settings (root props) in the Puck editor without replacing page content. Merges provided props with existing root props. Common props: title (string), pageLayout ("default" | "full-width" | "landing"), pageBackground (BackgroundValue | null), pageMaxWidth (string). BackgroundValue format: { type: "solid" | "gradient" | "image" | "none", solid: { hex, opacity } | null, gradient: GradientValue | null, image: ImageValue | null }. Do NOT use this for slug, folder, or pageSegment changes — those must go through payload_api (PATCH /api/pages/:id) to persist correctly.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        props: {
          type: 'object',
          description:
            'Partial root props to merge. Only include props you want to change — others are preserved.',
        },
      },
      required: ['props'],
    },
    execute: async (params: { props: Record<string, unknown> }) => {
      const { data } = accessors.getState()
      const currentRootProps = data.root?.props || {}
      const mergedProps = deepMerge(currentRootProps, params.props)

      const newData = {
        ...data,
        root: {
          ...data.root,
          props: mergedProps,
        },
      }

      accessors.dispatch({ type: 'setData', data: newData })

      const changedKeys = Object.keys(params.props)
      return {
        content: [
          {
            type: 'text',
            text: `Root props updated: ${changedKeys.join(', ')}. New values: ${JSON.stringify(params.props)}. Editor canvas updated — changes visible but NOT saved.`,
          },
        ],
      }
    },
  }
}
