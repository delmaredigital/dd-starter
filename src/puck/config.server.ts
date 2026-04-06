/**
 * Server-safe Puck Configuration
 *
 * This config is used for server-side rendering with HybridPageRenderer.
 * Imports from .render.tsx files to avoid client-only functions (createMediaField).
 */

import { baseConfig } from '@delmaredigital/payload-puck/config'
import { extendConfig } from '@delmaredigital/payload-puck/config'
import { competitionComponentsServer } from '@/components/puck/index.server'

export const puckServerConfig = extendConfig({
  base: baseConfig,
  components: competitionComponentsServer,
})
