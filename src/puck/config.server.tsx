/**
 * Server-safe Puck Configuration
 *
 * This config is used for server-side rendering with HybridPageRenderer.
 * Imports from .render.tsx files to avoid client-only functions (createMediaField).
 */

import { baseConfig } from '@delmaredigital/payload-puck/config'
import { extendConfig } from '@delmaredigital/payload-puck/config'
import { competitionComponentsServer } from '@/components/puck/index.server'
import { CompetitionColorsProvider } from '@/components/puck/CompetitionColors'
import type { ReactNode } from 'react'

export const puckServerConfig = extendConfig({
  base: baseConfig,
  components: competitionComponentsServer,
  root: {
    render: ({ primaryColor, secondaryColor, children }: { primaryColor?: string; secondaryColor?: string; children: ReactNode }) => (
      <CompetitionColorsProvider
        primaryColor={primaryColor || ''}
        secondaryColor={secondaryColor || ''}
      >
        {children}
      </CompetitionColorsProvider>
    ),
  },
})
