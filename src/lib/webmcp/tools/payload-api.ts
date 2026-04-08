/**
 * payload_api — generic REST wrapper for Payload collection operations.
 *
 * Use this for simple CRUD operations that don't need specialized logic.
 * For operations with specialized handling (editor state, file uploads,
 * MediaReference formatting), use the dedicated tools instead.
 */

export function createPayloadApiTool() {
  return {
    name: 'payload_api',
    description: `Generic Payload REST API wrapper for collection-level operations.
Use this for simple CRUD that doesn't need specialized logic (editor state, file uploads).
For Puck editor state operations, use get_page_state/update_page/update_root_props.
For image uploads, use upload_image. For saving editor state, use save_page.

Common endpoints (examples, not exhaustive — any Payload collection endpoint works):

Folders:
  POST /api/payload-folders { name: "org-slug" }
  GET  /api/payload-folders

Pages:
  POST   /api/pages { title, slug, pageSegment, folder: <folderId>, pageLayout, editorVersion: "puck", puckData: {...}, _status: "published" }
  PATCH  /api/pages/:id { pageSegment: "new-segment", folder: <folderId>, _status: "published" }
  DELETE /api/pages/:id
  GET    /api/pages?where[slug][equals]=<slug>
  GET    /api/pages/:id

Media:
  GET /api/media
  GET /api/media/:id

Discovery:
- GET /api lists all available collections and globals

Gotchas:
- folder field takes the folder's numeric ID, not the name — create folder first, use returned id
- Slug is auto-computed from folder path + pageSegment — don't set slug directly, set folder + pageSegment
- Use _status: "published" to publish immediately, omit for draft
- All requests use credentials: "include" for auth`,
    inputSchema: {
      type: 'object' as const,
      properties: {
        method: {
          type: 'string',
          enum: ['GET', 'POST', 'PATCH', 'DELETE'],
          description: 'HTTP method',
        },
        path: {
          type: 'string',
          description: 'API path, e.g. /api/pages/2 or /api/payload-folders',
        },
        body: {
          type: 'object',
          description: 'Request body (for POST/PATCH). Omit for GET/DELETE.',
        },
      },
      required: ['method', 'path'],
    },
    execute: async (params: { method: string; path: string; body?: Record<string, unknown> }) => {
      try {
        const options: RequestInit = {
          method: params.method,
          credentials: 'include',
        }

        if (params.body && (params.method === 'POST' || params.method === 'PATCH')) {
          options.headers = { 'Content-Type': 'application/json' }
          options.body = JSON.stringify(params.body)
        }

        const response = await fetch(params.path, options)
        const data = await response.json()

        if (!response.ok) {
          return {
            content: [{ type: 'text', text: `Error ${response.status}: ${JSON.stringify(data)}` }],
            isError: true,
          }
        }

        return {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
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
