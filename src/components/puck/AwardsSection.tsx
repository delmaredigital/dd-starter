/**
 * AwardsSection — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { createRichTextField } from './fields'
import { AwardsSectionRender, defaultProps, badgeIconOptions } from './AwardsSection.render'
import type { AwardsSectionProps } from './AwardsSection.render'

export type {
  AwardsSectionProps,
  BadgeItem,
  Round,
  FinalRound,
  SpecialAward,
} from './AwardsSection.render'
export { AwardsSectionRender, defaultProps, badgeIconOptions } from './AwardsSection.render'

const badgesArrayField = {
  type: 'array' as const,
  label: 'Badges',
  arrayFields: {
    badgeIcon: {
      type: 'select' as const,
      label: 'Badge Icon',
      options: [...badgeIconOptions],
    },
    label: { type: 'text' as const, label: 'Label' },
    sublabel: { type: 'text' as const, label: 'Sub-label (optional)' },
  },
}

export const AwardsSectionConfig: ComponentConfig<AwardsSectionProps> = {
  label: 'Awards Section',
  fields: {
    heading: {
      type: 'text',
      label: 'Heading (empty = default)',
      placeholder: defaultProps.heading,
    },
    introText: createRichTextField({ label: 'Intro Text' }),
    preliminary: {
      type: 'object',
      label: 'Preliminary Round',
      objectFields: {
        title: { type: 'text', label: 'Title' },
        badges: badgesArrayField,
      },
    },
    semiFinal: {
      type: 'object',
      label: 'Semi-Final Round',
      objectFields: {
        title: { type: 'text', label: 'Title' },
        badges: badgesArrayField,
      },
    },
    final: {
      type: 'object',
      label: 'Final Round',
      objectFields: {
        title: { type: 'text', label: 'Title' },
        subtitle: { type: 'text', label: 'Subtitle (optional)' },
        badges: badgesArrayField,
      },
    },
    showSpecialAwards: {
      type: 'radio',
      label: 'Show middle award cards',
      options: [
        { label: 'Yes (default)', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    individualAward: {
      type: 'object',
      label: 'Individual Award',
      objectFields: {
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
      },
    },
    teamAward: {
      type: 'object',
      label: 'Team Award',
      objectFields: {
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
      },
    },
    noteText: { type: 'textarea', label: 'Note Text (leave empty to hide)' },
    noteIcon: createMediaField({ label: 'Note Icon' }),
  },
  defaultProps,
  render: AwardsSectionRender,
}
