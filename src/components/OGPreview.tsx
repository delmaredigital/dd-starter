'use client'

import { useFormFields } from '@payloadcms/ui'

/**
 * Displays a preview of the auto-generated OG image in the Payload admin sidebar.
 * The image is generated dynamically via /api/og?slug=<page-slug>.
 */
export function OGPreviewField() {
  const slug = useFormFields(([fields]) => fields['slug']?.value as string | undefined)

  if (!slug) return (
    <div style={{ fontSize: 12, color: 'var(--theme-elevation-500)', marginBottom: 16 }}>
      Save the page first to preview the OG image.
    </div>
  )

  const ogUrl = `/api/og?slug=${encodeURIComponent(slug)}`

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: 'var(--theme-elevation-600)' }}>
        Open Graph Preview
      </label>
      <img
        src={ogUrl}
        alt="OG preview"
        style={{ width: '100%', borderRadius: 8, border: '1px solid var(--theme-elevation-150)' }}
      />
      <p style={{ fontSize: 11, color: 'var(--theme-elevation-400)', margin: '4px 0 0' }}>
        Auto-generated from hero content and brand colors
      </p>
    </div>
  )
}
