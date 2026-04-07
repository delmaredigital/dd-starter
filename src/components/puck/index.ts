/**
 * Shared competition component registry.
 * Both config.ts (editor) and config.server.ts (SSR) import from here
 * to prevent divergence.
 */
import { CompetitionHeroConfig } from './CompetitionHero'
import { TwoColumnFeatureConfig } from './TwoColumnFeature'
import { BenefitsGridConfig } from './BenefitsGrid'
import { EligibilityStripConfig } from './EligibilityStrip'
import { AboutPartnerConfig } from './AboutPartner'
import { CompetitionStructureConfig } from './CompetitionStructure'
import { DeadlineTableConfig } from './DeadlineTable'
import { CompetitionFormatConfig } from './CompetitionFormat'
import { AwardsSectionConfig } from './AwardsSection'
import { JoinCTAConfig } from './JoinCTA'
import { FeeWaiverConfig } from './FeeWaiver'
import { AlgoEdFooterConfig } from './AlgoEdFooter'
import { CompetitionFooterConfig } from './CompetitionFooter'
import { SummaryGridConfig } from './SummaryGrid'
import { CategoryGridConfig } from './CategoryGrid'
import { CompetitionNavConfig } from './CompetitionNav'

export const competitionComponents = {
  CompetitionHero: CompetitionHeroConfig,
  TwoColumnFeature: TwoColumnFeatureConfig,
  BenefitsGrid: BenefitsGridConfig,
  EligibilityStrip: EligibilityStripConfig,
  AboutPartner: AboutPartnerConfig,
  CompetitionStructure: CompetitionStructureConfig,
  DeadlineTable: DeadlineTableConfig,
  CompetitionFormat: CompetitionFormatConfig,
  AwardsSection: AwardsSectionConfig,
  JoinCTA: JoinCTAConfig,
  FeeWaiver: FeeWaiverConfig,
  AlgoEdFooter: AlgoEdFooterConfig,
  CompetitionFooter: CompetitionFooterConfig,
  SummaryGrid: SummaryGridConfig,
  CategoryGrid: CategoryGridConfig,
  CompetitionNav: CompetitionNavConfig,
}

export const competitionCategories = {
  competition: {
    title: 'Competition',
    components: [
      'CompetitionHero',
      'TwoColumnFeature',
      'BenefitsGrid',
      'EligibilityStrip',
      'AboutPartner',
      'CompetitionStructure',
      'DeadlineTable',
      'CompetitionFormat',
      'AwardsSection',
      'JoinCTA',
      'FeeWaiver',
      'AlgoEdFooter',
      'CompetitionFooter',
      'SummaryGrid',
      'CategoryGrid',
      'CompetitionNav',
    ] as string[],
    defaultExpanded: true,
  },
}
