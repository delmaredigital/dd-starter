/**
 * CompetitionHero — full editor config with field definitions.
 * Re-exports render + types from .render.tsx, adds createMediaField-based fields.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { createSliderField } from './fields'
import { iconOptions } from './icons'
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
    statusText: { type: 'text', label: 'Status Text (e.g. "Registration Open" or "Priority Registration Deadline")' },
    statusSubtext: { type: 'text', label: 'Status Subtext (e.g. "November 18, 2026" — leave empty for single line)' },
    ctaText: { type: 'text', label: 'CTA Button Text' },
    ctaLink: { type: 'text', label: 'CTA Button Link' },
    secondaryCtaText: { type: 'text', label: 'Secondary CTA Text (leave empty to hide)' },
    secondaryCtaLink: { type: 'text', label: 'Secondary CTA Link' },
    heroImage: createMediaField({ label: 'Hero Illustration (floats right of content)' }),
    backgroundImage: createMediaField({ label: 'Background Image (behind overlay)' }),
    overlayTopOpacity: createSliderField({ label: 'Overlay Top Opacity (default 80%)', min: 0, max: 100, step: 5 }),
    overlayBottomOpacity: createSliderField({ label: 'Overlay Bottom Opacity (default 100%)', min: 0, max: 100, step: 5 }),
    badgeStripHeading: { type: 'text', label: 'Badge Strip Heading (e.g. "Step into:" — leave empty to hide strip)' },
    badgeStripItems: {
      type: 'array',
      label: 'Badge Strip Items',
      arrayFields: {
        label: { type: 'text', label: 'Badge Label' },
        iconName: { type: 'select', label: 'Icon', options: iconOptions },
      },
      defaultItemProps: { label: 'Topic', iconName: '' },
    },
  },
  defaultProps,
  render: CompetitionHeroRender,
}
