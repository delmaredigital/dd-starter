import type { Plugin } from 'payload'
import { admin, isCMSAdmin } from '@/access/admin'

// Apply the starter's CMS role policy to the surfaces added by editor plugins.
export const cmsPluginAccess: Plugin = (config) => ({
  ...config,
  collections: config.collections?.map((collection) =>
    collection.slug === 'puck-templates'
      ? {
          ...collection,
          access: { ...collection.access, create: admin, update: admin, delete: admin },
        }
      : collection,
  ),
  // Page Tree handlers use trusted Local API operations. Reject before invoking
  // them: changing collection access alone does not protect these endpoints.
  endpoints: config.endpoints?.map((endpoint) =>
    endpoint.path.startsWith('/page-tree/')
      ? {
          ...endpoint,
          handler: async (req) => {
            if (!isCMSAdmin(req.user)) {
              return Response.json({ errors: [{ message: 'Forbidden' }] }, { status: 403 })
            }
            return endpoint.handler(req)
          },
        }
      : endpoint,
  ),
})
