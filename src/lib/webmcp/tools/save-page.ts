import type { PuckRootProps } from '@delmaredigital/payload-puck'
import type { PuckStateAccessors } from './get-page-state'

export function createSavePageTool(accessors: PuckStateAccessors) {
  return {
    name: 'save_page',
    description:
      'Saves Puck editor state to the database. Optionally publishes. Without publish, saves as draft. SEO (meta.title, meta.description, meta.image) is a Payload collection field — set it via payload_api, not puckData root props.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        publish: {
          type: 'boolean',
          description: 'If true, publishes the page (makes it live). If false or omitted, saves as draft.',
        },
      },
    },
    execute: async (params: { publish?: boolean }) => {
      try {
        const data = accessors.getState().data
        const rootProps: PuckRootProps = data.root?.props || {}

        // Extract page ID from the current URL: /<admin-path>/puck-editor/pages/:id
        const pathParts = window.location.pathname.split('/')
        const pageId = pathParts[pathParts.length - 1]
        // The API endpoint follows the pattern /api/puck/:collection
        const collection = pathParts[pathParts.length - 2] || 'pages'
        const apiEndpoint = `/api/puck/${collection}`

        const body: Record<string, unknown> = {
          puckData: data,
          title: rootProps.title || 'Untitled',
          slug: rootProps.slug,
          isHomepage: rootProps.isHomepage,
          folder: rootProps.folder,
          pageSegment: rootProps.pageSegment,
        }

        if (params.publish) {
          body._status = 'published'
        } else {
          body.draft = true
        }

        const response = await fetch(`${apiEndpoint}/${pageId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          credentials: 'include',
        })

        if (!response.ok) {
          const errorData = await response.json()
          return {
            content: [{ type: 'text', text: `Error: ${errorData.error || errorData.message || 'Save failed'} (${response.status})` }],
            isError: true,
          }
        }

        const action = params.publish ? 'Published' : 'Saved as draft'
        return {
          content: [{ type: 'text', text: `${action} successfully. Page "${rootProps.title}" (/${rootProps.slug}).` }],
        }
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  }
}
