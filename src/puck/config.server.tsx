/**
 * Server-safe Puck Configuration
 *
 * This config is used for server-side rendering with HybridPageRenderer.
 * Imports from .render.tsx files to avoid client-only functions (createMediaField).
 */

import { baseConfig } from '@delmaredigital/payload-puck/config'
import { extendConfig } from '@delmaredigital/payload-puck/config'
import { competitionComponentsServer } from '@/components/puck/index.server'
import { DEFAULT_HERO_THEME, DEFAULT_CTA_STYLE, resolveTheme, resolveCtaStyle } from './theme'
import type { ReactNode } from 'react'

export const puckServerConfig = extendConfig({
  base: baseConfig,
  components: competitionComponentsServer,
  root: {
    render: ({ primaryDark, primaryBright, heroTheme, heroTextStyle, highlightOverride, ctaStyle, heroCtaColor, children }: { primaryDark?: string; primaryBright?: string; heroTheme?: string; heroTextStyle?: string; highlightOverride?: string; ctaStyle?: string; heroCtaColor?: string; children: ReactNode }) => {
      const override = heroTextStyle === 'default' ? undefined : heroTextStyle
      const t = resolveTheme(heroTheme ?? DEFAULT_HERO_THEME, override)
      const c = resolveCtaStyle(ctaStyle ?? DEFAULT_CTA_STYLE)
      const heroCta = heroCtaColor === 'bright-dark'
        ? { bg: 'var(--primary-bright)', text: 'var(--primary-dark)' }
        : heroCtaColor === 'bright-white'
        ? { bg: 'var(--primary-bright)', text: '#ffffff' }
        : { bg: 'var(--highlight-bg)', text: 'var(--highlight-text)' }
      return (
      <div style={{
        '--primary-dark': primaryDark || '#222',
        '--primary-bright': primaryBright || primaryDark || '#222',
        '--hero-overlay': t.overlay,
        '--hero-text': t.heroText,
        '--highlight-bg': highlightOverride || t.highlightBg,
        '--highlight-text': t.highlightText,
        '--hero-cta-bg': heroCta.bg,
        '--hero-cta-text': heroCta.text,
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
