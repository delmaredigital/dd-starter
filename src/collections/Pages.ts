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
  // Hides the Puck plugin's built-in SEO form inputs — does NOT disable SEO itself.
  // DB columns, sync, and meta tag rendering are unaffected.
  // We define our own meta group below (without image picker, with OG preview).
  includeSEO: false,
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
    // SEO fields — own definition without image picker (OG image is auto-generated via /api/og)
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'title', type: 'text', label: 'Meta Title', admin: { description: 'Override the page title for search engines' } },
        { name: 'description', type: 'textarea', label: 'Meta Description', admin: { description: 'Description shown in search engine results' } },
        {
          name: 'ogPreview',
          type: 'ui',
          admin: {
            components: { Field: '@/components/OGPreview#OGPreviewField' },
          },
        },
        { name: 'noindex', type: 'checkbox', label: 'No Index', admin: { description: 'Prevent search engines from indexing this page' } },
        { name: 'nofollow', type: 'checkbox', label: 'No Follow', admin: { description: 'Prevent search engines from following links on this page' } },
        { name: 'excludeFromSitemap', type: 'checkbox', label: 'Exclude from Sitemap', admin: { description: 'Exclude this page from the XML sitemap' } },
      ],
    },
  ],
}
