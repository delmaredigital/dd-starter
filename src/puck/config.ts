'use client'

import { extendConfig } from '@delmaredigital/payload-puck/config/editor'
import { fullConfig } from '@delmaredigital/payload-puck/config/editor'
import { competitionComponents, competitionCategories } from '@/components/puck'

export const puckConfig = extendConfig({
  base: fullConfig,
  components: competitionComponents,
  categories: competitionCategories,
})
