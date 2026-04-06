/**
 * Shared competition component registry.
 * Both config.ts (editor) and config.server.ts (SSR) import from here
 * to prevent divergence.
 */
import { CompetitionHeroConfig } from './CompetitionHero'
import { TwoColumnFeatureConfig } from './TwoColumnFeature'
import { BenefitsGridConfig } from './BenefitsGrid'

export const competitionComponents = {
  CompetitionHero: CompetitionHeroConfig,
  TwoColumnFeature: TwoColumnFeatureConfig,
  BenefitsGrid: BenefitsGridConfig,
}

export const competitionCategories = {
  competition: {
    title: 'Competition',
    components: ['CompetitionHero', 'TwoColumnFeature', 'BenefitsGrid'] as string[],
    defaultExpanded: true,
  },
}
