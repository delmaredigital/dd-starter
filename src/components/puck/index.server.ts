/**
 * Server-safe competition component registry.
 * Imports from .render.tsx files which don't use client-only functions (createMediaField).
 */
import {
  CompetitionHeroRender,
  defaultProps as heroDefaults,
} from './CompetitionHero.render'
import {
  TwoColumnFeatureRender,
  defaultProps as featureDefaults,
} from './TwoColumnFeature.render'
import {
  BenefitsGridRender,
  defaultProps as gridDefaults,
} from './BenefitsGrid.render'
import {
  EligibilityStripRender,
  defaultProps as eligibilityDefaults,
} from './EligibilityStrip.render'
import {
  AboutPartnerRender,
  defaultProps as aboutDefaults,
} from './AboutPartner.render'
import {
  CompetitionStructureRender,
  defaultProps as structureDefaults,
} from './CompetitionStructure.render'
import {
  DeadlineTableRender,
  defaultProps as deadlineDefaults,
} from './DeadlineTable.render'
import {
  CompetitionFormatRender,
  defaultProps as formatDefaults,
} from './CompetitionFormat.render'
import {
  AwardsSectionRender,
  defaultProps as awardsDefaults,
} from './AwardsSection.render'
import {
  AwardsSectionLegacyRender,
  defaultProps as awardsLegacyDefaults,
} from './AwardsSectionLegacy.render'
import {
  JoinCTARender,
  defaultProps as joinDefaults,
} from './JoinCTA.render'
import {
  FeeWaiverRender,
  defaultProps as feeWaiverDefaults,
} from './FeeWaiver.render'
import {
  AlgoEdFooterRender,
  defaultProps as algoEdFooterDefaults,
} from './AlgoEdFooter.render'
import {
  CompetitionFooterRender,
  defaultProps as compFooterDefaults,
} from './CompetitionFooter.render'
import {
  SummaryGridRender,
  defaultProps as summaryDefaults,
} from './SummaryGrid.render'
import {
  CategoryGridRender,
  defaultProps as categoryDefaults,
} from './CategoryGrid.render'
import {
  CompetitionNavRender,
  defaultProps as navDefaults,
} from './CompetitionNav.render'
import {
  ResponsiveImageSectionRender,
  defaultProps as responsiveImageDefaults,
} from './ResponsiveImageSection.render'
import {
  HighlightBadgesRender,
  defaultProps as highlightBadgesDefaults,
} from './HighlightBadges.render'
import {
  EligibilitySectionRender,
  defaultProps as eligibilitySectionDefaults,
} from './EligibilitySection.render'
import {
  CompetitionFormatV2Render,
  defaultProps as formatV2Defaults,
} from './CompetitionFormatV2.render'
import {
  AboutPartnerV2Render,
  defaultProps as aboutPartnerV2Defaults,
} from './AboutPartnerV2.render'
import {
  AboutLeagueRender,
  defaultProps as aboutLeagueDefaults,
} from './AboutLeague.render'
import {
  FosteringSectionRender,
  defaultProps as fosteringDefaults,
} from './FosteringSection.render'

// extendConfig erases component generics to PuckComponent<any>, which is incompatible
// with our typed render functions due to contravariance. The plugin's own built-in
// server components avoid this by being pre-baked into baseConfig.
// This cast is at the plugin API boundary — the types are compatible at runtime.
export const competitionComponentsServer = {
  CompetitionHero: {
    label: 'Competition Hero',
    defaultProps: heroDefaults,
    render: CompetitionHeroRender,
  },
  TwoColumnFeature: {
    label: 'Two Column Feature',
    defaultProps: featureDefaults,
    fields: { body: { type: 'richtext' as const } },
    render: TwoColumnFeatureRender,
  },
  BenefitsGrid: {
    label: 'Benefits Grid',
    defaultProps: gridDefaults,
    render: BenefitsGridRender,
  },
  EligibilityStrip: {
    label: 'Eligibility Strip',
    defaultProps: eligibilityDefaults,
    render: EligibilityStripRender,
  },
  AboutPartner: {
    label: 'About Partner',
    defaultProps: aboutDefaults,
    render: AboutPartnerRender,
  },
  CompetitionStructure: {
    label: 'Competition Structure',
    defaultProps: structureDefaults,
    render: CompetitionStructureRender,
  },
  DeadlineTable: {
    label: 'Deadline Table',
    defaultProps: deadlineDefaults,
    render: DeadlineTableRender,
  },
  CompetitionFormat: {
    label: 'Competition Format',
    defaultProps: formatDefaults,
    render: CompetitionFormatRender,
  },
  AwardsSection: {
    label: 'Awards Section',
    defaultProps: awardsDefaults,
    fields: { introText: { type: 'richtext' as const } },
    render: AwardsSectionRender,
  },
  AwardsSectionLegacy: {
    label: 'Awards Section (Legacy)',
    defaultProps: awardsLegacyDefaults,
    render: AwardsSectionLegacyRender,
  },
  JoinCTA: {
    label: 'Join CTA',
    defaultProps: joinDefaults,
    render: JoinCTARender,
  },
  FeeWaiver: {
    label: 'Fee Waiver',
    defaultProps: feeWaiverDefaults,
    render: FeeWaiverRender,
  },
  AlgoEdFooter: {
    label: 'AlgoEd Footer',
    defaultProps: algoEdFooterDefaults,
    render: AlgoEdFooterRender,
  },
  CompetitionFooter: {
    label: 'Competition Footer',
    defaultProps: compFooterDefaults,
    render: CompetitionFooterRender,
  },
  SummaryGrid: {
    label: 'Summary Grid',
    defaultProps: summaryDefaults,
    render: SummaryGridRender,
  },
  CategoryGrid: {
    label: 'Category Grid',
    defaultProps: categoryDefaults,
    render: CategoryGridRender,
  },
  CompetitionNav: {
    label: 'Competition Nav',
    defaultProps: navDefaults,
    render: CompetitionNavRender,
  },
  ResponsiveImageSection: {
    label: 'Responsive Image Section',
    defaultProps: responsiveImageDefaults,
    render: ResponsiveImageSectionRender,
  },
  HighlightBadges: {
    label: 'Highlight Badges',
    defaultProps: highlightBadgesDefaults,
    render: HighlightBadgesRender,
  },
  EligibilitySection: {
    label: 'Eligibility Section',
    defaultProps: eligibilitySectionDefaults,
    render: EligibilitySectionRender,
  },
  CompetitionFormatV2: {
    label: 'Competition Format V2',
    defaultProps: formatV2Defaults,
    fields: {
      rounds: {
        type: 'array' as const,
        arrayFields: {
          infoCards: {
            type: 'array' as const,
            arrayFields: { body: { type: 'richtext' as const } },
          },
          formatDetails: { type: 'richtext' as const },
          body: { type: 'richtext' as const },
        },
      },
    },
    render: CompetitionFormatV2Render,
  },
  AboutPartnerV2: {
    label: 'About Partner V2',
    defaultProps: aboutPartnerV2Defaults,
    fields: { body: { type: 'richtext' as const } },
    render: AboutPartnerV2Render,
  },
  AboutLeague: {
    label: 'About League',
    defaultProps: aboutLeagueDefaults,
    fields: { body: { type: 'richtext' as const } },
    render: AboutLeagueRender,
  },
  FosteringSection: {
    label: 'Fostering Section',
    defaultProps: fosteringDefaults,
    fields: { body: { type: 'richtext' as const } },
    render: FosteringSectionRender,
  },
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- see comment above
} as any
