'use client'

import { extendConfig } from '@delmaredigital/payload-puck/config/editor'
import { fullConfig } from '@delmaredigital/payload-puck/config/editor'
import { competitionComponents, competitionCategories } from '@/components/puck'
import { createColorField, createOptionalColorField } from '@/components/puck/fields'
import type { ReactNode } from 'react'

export const puckConfig = extendConfig({
  base: fullConfig,
  components: competitionComponents,
  categories: competitionCategories,
  root: {
    fields: {
      primaryDark: createColorField({ label: 'Primary Dark (text, borders, UI — required)' }),
      primaryBright: createOptionalColorField({ label: 'Primary Bright (hero overlay, accents — optional)' }),
    },
    defaultProps: {
      primaryDark: '',
      primaryBright: '',
    },
    render: ({ primaryDark, primaryBright, children }: { primaryDark?: string; primaryBright?: string; children: ReactNode }) => (
      <div style={{
        '--primary-dark': primaryDark || '#222',
        '--primary-bright': primaryBright || primaryDark || '#222',
      } as React.CSSProperties}>
        {children}
      </div>
    ),
  },
})
