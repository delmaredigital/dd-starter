/**
 * AwardsSection — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { AwardsSectionRender, defaultProps } from './AwardsSection.render'
import type { AwardsSectionProps } from './AwardsSection.render'

export type { AwardsSectionProps, AwardGroup, BadgeItem, SpecialAward } from './AwardsSection.render'
export { AwardsSectionRender, defaultProps } from './AwardsSection.render'

export const AwardsSectionConfig: ComponentConfig<AwardsSectionProps> = {
  label: 'Awards Section',
  fields: {
    heading: { type: 'text', label: 'Heading' },
    introText: { type: 'textarea', label: 'Intro Text' },
    groups: {
      type: 'array',
      label: 'Award Groups',
      arrayFields: {
        roundTitle: { type: 'text', label: 'Round Title' },
        subtitle: { type: 'text', label: 'Subtitle' },
        variant: {
          type: 'select',
          label: 'Card Style',
          options: [
            { label: 'Default (white)', value: 'default' },
            { label: 'Final (gold)', value: 'final' },
          ],
        },
        badges: {
          type: 'array',
          label: 'Badges',
          arrayFields: {
            icon: createMediaField({ label: 'Badge Icon' }),
            label: { type: 'text', label: 'Label' },
            sublabel: { type: 'text', label: 'Sub-label (optional)' },
          },
        },
      },
    },
    specialAwards: {
      type: 'array',
      label: 'Special Awards',
      arrayFields: {
        icon: createMediaField({ label: 'Award Icon' }),
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
