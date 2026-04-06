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
    render: TwoColumnFeatureRender,
  },
  BenefitsGrid: {
    label: 'Benefits Grid',
    defaultProps: gridDefaults,
    render: BenefitsGridRender,
  },
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- see comment above
} as any
