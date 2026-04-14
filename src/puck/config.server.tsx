/**
 * Server-safe Puck Configuration
 *
 * This config is used for server-side rendering with HybridPageRenderer.
 * Imports from .render.tsx files to avoid client-only functions (createMediaField).
 */

import { baseConfig } from '@delmaredigital/payload-puck/config'
import { extendConfig } from '@delmaredigital/payload-puck/config'
import { competitionComponentsServer } from '@/components/puck/index.server'
import type { ReactNode } from 'react'

export const puckServerConfig = extendConfig({
  base: baseConfig,
  components: competitionComponentsServer,
  root: {
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
