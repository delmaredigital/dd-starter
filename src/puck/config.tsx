'use client'

import { extendConfig } from '@delmaredigital/payload-puck/config/editor'
import { fullConfig } from '@delmaredigital/payload-puck/config/editor'
import { competitionComponents, competitionCategories } from '@/components/puck'
import { createColorField, createOptionalColorField, createPillField } from '@/components/puck/fields'
import type { ReactNode } from 'react'

export const puckConfig = extendConfig({
  base: fullConfig,
  components: competitionComponents,
  categories: competitionCategories,
  root: {
    fields: {
      primaryDark: createColorField({ label: 'Primary Dark (text, borders, UI — required)' }),
      primaryBright: createOptionalColorField({ label: 'Primary Bright (hero overlay, accents — optional)' }),
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
      ctaStyle: 'dark',
    },
    render: ({ primaryDark, primaryBright, ctaStyle, children }: { primaryDark?: string; primaryBright?: string; ctaStyle?: string; children: ReactNode }) => {
      const style = ctaStyle ?? 'dark'
      const isBright = style === 'bright' || style === 'bright-dark'
      return (
      <div style={{
        '--primary-dark': primaryDark || '#222',
        '--primary-bright': primaryBright || primaryDark || '#222',
        '--cta-bg': isBright ? 'var(--primary-bright)' : 'var(--primary-dark)',
        '--cta-text': style === 'bright-dark' ? 'var(--primary-dark)' : '#ffffff',
      } as React.CSSProperties}>
        {children}
      </div>
      )
    },
  },
})
