import type { CollectionConfig } from 'payload'
import { TemplatesCollection } from '@delmaredigital/payload-puck/plugin'

import { admin } from '@/access/admin'

/**
 * Puck's reusable-template collection. The plugin registers its own copy only
 * when no collection with this slug exists, so defining it here lets us apply
 * the starter's role model (plugin default: any authenticated user may write).
 */
export const PuckTemplates: CollectionConfig = {
  ...TemplatesCollection,
  access: {
    ...TemplatesCollection.access,
    create: admin,
    update: admin,
    delete: admin,
  },
}
