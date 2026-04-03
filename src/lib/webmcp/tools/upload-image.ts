import type { PuckStateAccessors } from './get-page-state'

export function createUploadImageTool(_accessors: PuckStateAccessors) {
  return {
    name: 'upload_image',
    description:
      'Uploads an image to the Payload media library. Provide either a URL (fetched client-side) or base64 data (for local files). Returns the media ID for use in Image and Card component props (set the "image" prop to the returned ID). The upload uses the current admin session for authentication. Note: URL fetch may fail for non-CDN origins due to CORS — prefer base64 for images from servers without permissive CORS headers.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        url: {
          type: 'string',
          description: 'Public URL of the image to fetch and upload. Provide this OR base64, not both.',
        },
        base64: {
          type: 'string',
          description: 'Base64-encoded image data (without the data: prefix). For uploading local files — the agent reads the file and passes the base64 string.',
        },
        mimeType: {
          type: 'string',
          description: 'MIME type when using base64 (e.g. "image/png", "image/jpeg"). Required with base64, ignored with url.',
        },
        alt: {
          type: 'string',
          description: 'Alt text for the image. Recommended for accessibility.',
        },
        filename: {
          type: 'string',
          description: 'Filename for the uploaded file. Optional — defaults to "upload.{ext}" for base64 or derived from URL.',
        },
      },
    },
    execute: async (params: { url?: string; base64?: string; mimeType?: string; alt?: string; filename?: string }) => {
      try {
        let blob: Blob
        let filename: string

        if (params.base64) {
          // Local file: agent read the file and passed base64
          if (!params.mimeType) {
            return {
              content: [{ type: 'text', text: 'Error: "mimeType" is required when using base64 (e.g. "image/png", "image/jpeg", "image/webp").' }],
              isError: true,
            }
          }
          const mimeType = params.mimeType
          blob = await fetch(`data:${mimeType};base64,${params.base64}`).then(r => r.blob())
          const extension = mimeType.split('/')[1] || 'jpg'
          filename = params.filename || `upload.${extension}`
        } else if (params.url) {
          // Remote URL: fetch client-side
          const response = await fetch(params.url)
          if (!response.ok) {
            return {
              content: [{ type: 'text', text: `Error: Failed to fetch image from "${params.url}" — ${response.status} ${response.statusText}` }],
              isError: true,
            }
          }
          blob = await response.blob()
          const extension = blob.type ? blob.type.split('/')[1] : 'bin'
          filename = params.filename || params.url.split('/').pop()?.split('?')[0] || `image.${extension}`
        } else {
          return {
            content: [{ type: 'text', text: 'Error: Provide either "url" or "base64" parameter.' }],
            isError: true,
          }
        }

        // Build multipart form data for Payload's media upload endpoint
        const formData = new FormData()
        formData.append('file', blob, filename)
        if (params.alt) {
          formData.append('alt', params.alt)
        }

        // POST to Payload's media REST API (admin session cookie handles auth)
        const uploadResponse = await fetch('/api/media', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        })

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text()
          return {
            content: [{ type: 'text', text: `Error: Upload failed — ${uploadResponse.status} ${uploadResponse.statusText}. ${errorText}` }],
            isError: true,
          }
        }

        const media = await uploadResponse.json()

        if (!media?.doc?.id) {
          return {
            content: [{ type: 'text', text: `Error: Unexpected response from Payload. Raw: ${JSON.stringify(media)}` }],
            isError: true,
          }
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              id: media.doc.id,
              url: media.doc.url,
              filename: media.doc.filename,
              mimeType: media.doc.mimeType,
              width: media.doc.width,
              height: media.doc.height,
              usage: 'Use the "id" value as the "image" prop in Image or Card components.',
            }, null, 2),
          }],
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
