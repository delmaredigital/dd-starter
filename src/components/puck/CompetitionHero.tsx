/**
 * CompetitionHero — full editor config with field definitions.
 * Re-exports render + types from .render.tsx, adds createMediaField-based fields.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { createColorField, createOptionalColorField } from './fields'
import { CompetitionHeroRender, defaultProps } from './CompetitionHero.render'
import type { CompetitionHeroProps } from './CompetitionHero.render'

export type { CompetitionHeroProps } from './CompetitionHero.render'
export { CompetitionHeroRender, defaultProps } from './CompetitionHero.render'

export const CompetitionHeroConfig: ComponentConfig<CompetitionHeroProps> = {
  label: 'Competition Hero',
  fields: {
    titleLine1: { type: 'text', label: 'Title Line 1 (e.g. "MIT EWB")' },
    titleLine2: { type: 'text', label: 'Title Line 2 — highlighted (e.g. "SCIENCE & ENGINEERING")' },
    titleLine3: { type: 'text', label: 'Title Line 3 (e.g. "COMPETITION 2026")' },
    audienceLabel: { type: 'text', label: 'Audience (e.g. "For Middle and High School Students")' },
    primaryColor: createColorField({ label: 'Brand Color' }),
    highlightTextColor: createColorField({ label: 'Highlight Text Color' }),
    statusText: { type: 'text', label: 'Status Text (e.g. "Registration Open" or "Priority Registration Deadline")' },
    statusSubtext: { type: 'text', label: 'Status Subtext (e.g. "November 18, 2026" — leave empty for single line)' },
    ctaText: { type: 'text', label: 'CTA Button Text' },
    ctaLink: { type: 'text', label: 'CTA Button Link' },
    secondaryCtaText: { type: 'text', label: 'Secondary CTA Text (leave empty to hide)' },
    secondaryCtaLink: { type: 'text', label: 'Secondary CTA Link' },
    heroImage: createMediaField({ label: 'Hero Illustration (floats right of content)' }),
    heroImageWidth: { type: 'number', label: 'Hero Image Width (px, default 400)' },
    heroImageRightOffset: { type: 'number', label: 'Hero Image Right Offset (px past content edge, default 45)' },
    heroImageBottomGap: { type: 'number', label: 'Hero Image Bottom Gap (px from hero bottom, default 8)' },
    backgroundImage: createMediaField({ label: 'Background Image (behind overlay)' }),
    overlayColor: createOptionalColorField({ label: 'Overlay Color (clear = use Brand Color)' }),
    overlayOpacity: { type: 'number', label: 'Overlay Opacity (0-100, default 90)' },
    overlayCSS: { type: 'text', label: 'Overlay CSS Override (advanced — raw CSS gradient replaces color+opacity, e.g. "linear-gradient(rgba(75,156,211,0.8), rgba(75,156,211,1))")' },
    badgeStripHeading: { type: 'text', label: 'Badge Strip Heading (e.g. "Step into:" — leave empty to hide strip)' },
    badgeStripItems: {
      type: 'array',
      label: 'Badge Strip Items',
      arrayFields: {
        label: { type: 'text', label: 'Badge Label' },
        icon: createMediaField({ label: 'Badge Icon' }),
      },
      defaultItemProps: { label: 'Topic', icon: null },
    },
  },
  defaultProps,
  render: CompetitionHeroRender,
}
