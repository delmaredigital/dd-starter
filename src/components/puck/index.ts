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
import { AwardsSectionLegacyConfig } from './AwardsSectionLegacy'
import { JoinCTAConfig } from './JoinCTA'
import { FeeWaiverConfig } from './FeeWaiver'
import { AlgoEdFooterConfig } from './AlgoEdFooter'
import { CompetitionFooterConfig } from './CompetitionFooter'
import { SummaryGridConfig } from './SummaryGrid'
import { CategoryGridConfig } from './CategoryGrid'
import { CompetitionNavConfig } from './CompetitionNav'
import { ResponsiveImageSectionConfig } from './ResponsiveImageSection'
import { HighlightBadgesConfig } from './HighlightBadges'
import { EligibilitySectionConfig } from './EligibilitySection'
import { CompetitionFormatV2Config } from './CompetitionFormatV2'

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
  AwardsSectionLegacy: AwardsSectionLegacyConfig,
  JoinCTA: JoinCTAConfig,
  FeeWaiver: FeeWaiverConfig,
  AlgoEdFooter: AlgoEdFooterConfig,
  CompetitionFooter: CompetitionFooterConfig,
  SummaryGrid: SummaryGridConfig,
  CategoryGrid: CategoryGridConfig,
  CompetitionNav: CompetitionNavConfig,
  ResponsiveImageSection: ResponsiveImageSectionConfig,
  HighlightBadges: HighlightBadgesConfig,
  EligibilitySection: EligibilitySectionConfig,
  CompetitionFormatV2: CompetitionFormatV2Config,
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
      'AwardsSectionLegacy',
      'JoinCTA',
      'FeeWaiver',
      'AlgoEdFooter',
      'CompetitionFooter',
      'SummaryGrid',
      'CategoryGrid',
      'CompetitionNav',
      'ResponsiveImageSection',
      'HighlightBadges',
      'EligibilitySection',
      'CompetitionFormatV2',
    ] as string[],
    defaultExpanded: true,
  },
}
