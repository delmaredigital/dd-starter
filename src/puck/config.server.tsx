/**
 * Server-safe Puck Configuration
 *
 * This config is used for server-side rendering with HybridPageRenderer.
 * Imports from .render.tsx files to avoid client-only functions (createMediaField).
 */

import { baseConfig } from '@delmaredigital/payload-puck/config'
import { extendConfig } from '@delmaredigital/payload-puck/config'
import { competitionComponentsServer } from '@/components/puck/index.server'
import { DEFAULT_HERO_THEME, resolveTheme } from './theme'
import type { ReactNode } from 'react'

export const puckServerConfig = extendConfig({
  base: baseConfig,
  components: competitionComponentsServer,
  root: {
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
