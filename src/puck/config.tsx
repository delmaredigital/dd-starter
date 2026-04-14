'use client'

import { extendConfig } from '@delmaredigital/payload-puck/config/editor'
import { fullConfig } from '@delmaredigital/payload-puck/config/editor'
import { competitionComponents, competitionCategories } from '@/components/puck'
import { createColorField, createOptionalColorField, createPillField } from '@/components/puck/fields'
import { HERO_THEMES, DEFAULT_HERO_THEME, resolveTheme } from './theme'
import type { ReactNode } from 'react'

export const puckConfig = extendConfig({
  base: fullConfig,
  components: competitionComponents,
  categories: competitionCategories,
  root: {
    fields: {
      primaryDark: createColorField({ label: 'Primary Dark (text, borders, UI — required)' }),
      primaryBright: createOptionalColorField({ label: 'Primary Bright (hero overlay, accents — optional)' }),
      heroTheme: {
        type: 'select' as const,
        label: 'Hero Theme',
        options: HERO_THEMES,
      },
      ctaStyle: createPillField({
        label: 'CTA Button Style',
        options: [
          { label: 'Dark', value: 'dark' },
          { label: 'Bright', value: 'bright' },
          { label: 'Bright + Dark Text', value: 'bright-dark' },
        ],
        defaultValue: 'dark',
      }),
    },
    defaultProps: {
      primaryDark: '',
      primaryBright: '',
      heroTheme: DEFAULT_HERO_THEME,
      ctaStyle: 'dark',
    },
    render: ({ primaryDark, primaryBright, heroTheme, ctaStyle, children }: { primaryDark?: string; primaryBright?: string; heroTheme?: string; ctaStyle?: string; children: ReactNode }) => {
      const t = resolveTheme(heroTheme ?? DEFAULT_HERO_THEME)
      const cta = ctaStyle ?? 'dark'
      const ctaIsBright = cta === 'bright' || cta === 'bright-dark'
      return (
      <div style={{
        '--primary-dark': primaryDark || '#222',
        '--primary-bright': primaryBright || primaryDark || '#222',
        '--hero-overlay': t.overlay,
        '--hero-text': t.heroText,
        '--highlight-bg': t.highlightBg,
        '--highlight-text': t.highlightText,
        '--cta-bg': ctaIsBright ? 'var(--primary-bright)' : 'var(--primary-dark)',
        '--cta-text': cta === 'bright-dark' ? 'var(--primary-dark)' : '#ffffff',
      } as React.CSSProperties}>
        {children}
      </div>
      )
    },
  },
})
