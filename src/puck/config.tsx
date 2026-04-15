'use client'

import { extendConfig } from '@delmaredigital/payload-puck/config/editor'
import { fullConfig } from '@delmaredigital/payload-puck/config/editor'
import { competitionComponents, competitionCategories } from '@/components/puck'
import { createColorField, createOptionalColorField, createPillField } from '@/components/puck/fields'
import { HERO_THEMES, DEFAULT_HERO_THEME, CTA_STYLES, DEFAULT_CTA_STYLE, resolveTheme, resolveCtaStyle } from './theme'
import type { ReactNode } from 'react'

export const puckConfig = extendConfig({
  base: fullConfig,
  components: competitionComponents,
  categories: competitionCategories,
  root: {
    fields: {
      primaryDark: createColorField({ label: 'Primary Dark (text, borders, UI — required)' }),
      primaryBright: createOptionalColorField({ label: 'Primary Bright (hero overlay, accents — optional)', emptyText: 'Using Primary Dark' }),
      heroTheme: {
        type: 'select' as const,
        label: 'Hero Theme',
        options: HERO_THEMES,
      },
      heroTextStyle: createPillField({
        label: 'Hero Text Color',
        options: [
          { label: 'Default (follows highlight)', value: 'default' },
          { label: 'White', value: 'white' },
          { label: 'Primary', value: 'primary' },
        ],
        defaultValue: 'default',
      }),
      highlightOverride: createOptionalColorField({ label: 'Override Highlight', emptyText: 'Using theme preset' }),
      ctaStyle: {
        type: 'select' as const,
        label: 'CTA Button Style',
        options: CTA_STYLES,
      },
    },
    defaultProps: {
      primaryDark: '',
      primaryBright: '',
      heroTheme: DEFAULT_HERO_THEME,
      heroTextStyle: 'default',
      highlightOverride: '',
      ctaStyle: DEFAULT_CTA_STYLE,
    },
    render: ({ primaryDark, primaryBright, heroTheme, heroTextStyle, highlightOverride, ctaStyle, children }: { primaryDark?: string; primaryBright?: string; heroTheme?: string; heroTextStyle?: string; highlightOverride?: string; ctaStyle?: string; children: ReactNode }) => {
      const override = heroTextStyle === 'default' ? undefined : heroTextStyle
      const t = resolveTheme(heroTheme ?? DEFAULT_HERO_THEME, override)
      const c = resolveCtaStyle(ctaStyle ?? DEFAULT_CTA_STYLE)
      return (
      <div style={{
        '--primary-dark': primaryDark || '#222',
        '--primary-bright': primaryBright || primaryDark || '#222',
        '--hero-overlay': t.overlay,
        '--hero-text': t.heroText,
        '--highlight-bg': highlightOverride || t.highlightBg,
        '--highlight-text': t.highlightText,
        '--cta-bg': c.bg,
        '--cta-text': c.text,
        '--cta2-bg': c.bg2,
        '--cta2-text': c.text2,
        '--cta2-border': c.border2,
      } as React.CSSProperties}>
        {children}
      </div>
      )
    },
  },
})
