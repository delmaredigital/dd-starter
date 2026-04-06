/**
 * Server-safe Puck Configuration
 *
 * This config is used for server-side rendering with HybridPageRenderer.
 */

import { baseConfig } from '@delmaredigital/payload-puck/config'
import { extendConfig } from '@delmaredigital/payload-puck/config'
import { competitionComponents } from '@/components/puck'

export const puckServerConfig = extendConfig({
  base: baseConfig,
  components: competitionComponents,
})
