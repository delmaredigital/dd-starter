/**
 * Pages collection — composed with getPuckCollectionConfig() for explicit field/hook ownership.
 *
 * Uses the plugin's recommended hybrid integration pattern instead of an empty stub.
 * The plugin still merges additional config (versions, edit button) at runtime,
 * but we own the fields, hooks, and access explicitly.
 *
 * @see https://delmaredigital.github.io/payload-puck/ (Hybrid collection integration)
 */
import type { CollectionConfig } from 'payload'
import { getPuckCollectionConfig } from '@delmaredigital/payload-puck/plugin'
import { puckLayoutOptions } from '@/lib/puck/layout-options'
import { revalidatePage, revalidateDeletePage } from '@/hooks/revalidatePage'

const puckConfig = getPuckCollectionConfig({
  includeSEO: true,
  includeConversion: true,
  includeEditorVersion: true,
  includePageLayout: true,
  includeIsHomepage: true,
  layouts: puckLayoutOptions,
})

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  },
  access: {
    read: () => true, // Pages are public content — needed for generateStaticParams during build
  },
  hooks: {
    // beforeChange is intentionally omitted — createPuckPlugin adds isHomepageUniqueHook
    // during its merge step. Including it here would duplicate the hook.
    afterChange: [revalidatePage],
    afterDelete: [revalidateDeletePage],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL path for this page (auto-generated from title)',
      },
    },
    ...puckConfig.fields,
  ],
}
