/**
 * CompetitionStructure — full editor config with field definitions.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { createMediaField } from '@delmaredigital/payload-puck/fields'
import { CompetitionStructureRender, defaultProps } from './CompetitionStructure.render'
import type { CompetitionStructureProps } from './CompetitionStructure.render'

export type { CompetitionStructureProps, CategoryItem, RoundItem, BulletItem } from './CompetitionStructure.render'
export { CompetitionStructureRender, defaultProps } from './CompetitionStructure.render'

export const CompetitionStructureConfig: ComponentConfig<CompetitionStructureProps> = {
  label: 'Competition Structure',
  fields: {
    heading: { type: 'text', label: 'Heading' },
    subheading: { type: 'text', label: 'Subheading' },
    structureBgImage: createMediaField({ label: 'Structure Card Background Image' }),
    teamSize: { type: 'textarea', label: 'Team Size Description' },
    teamIcon: createMediaField({ label: 'Team Size Icon' }),
    categoriesIcon: createMediaField({ label: 'Categories Icon' }),
    categories: {
      type: 'array',
      label: 'Categories',
      arrayFields: {
        name: { type: 'text', label: 'Category Name' },
        grades: { type: 'text', label: 'Grades' },
      },
    },
    categoryDivider: createMediaField({ label: 'Category Divider Image' }),
    rounds: {
      type: 'array',
      label: 'Rounds (What teams need to do)',
      arrayFields: {
        title: { type: 'text', label: 'Round Title' },
        titleIcon: createMediaField({ label: 'Title Icon' }),
        bulletIcon: createMediaField({ label: 'Bullet Icon (repeated per bullet)' }),
        bullets: {
          type: 'array',
          label: 'Bullet Points',
          arrayFields: {
            value: { type: 'textarea', label: 'Bullet Text' },
            isLink: {
              type: 'radio',
              label: 'Is Link?',
              options: [
                { label: 'No', value: false },
                { label: 'Yes', value: true },
              ],
            },
            href: { type: 'text', label: 'Link URL (if link)' },
          },
        },
      },
    },
    roundsIcon: createMediaField({ label: 'Rounds Section Icon' }),
    ctaText: { type: 'text', label: 'CTA Button Text (leave empty to hide)' },
    ctaLink: { type: 'text', label: 'CTA Button Link' },
    primaryColor: { type: 'text', label: 'Brand Color (hex)' },
  },
  defaultProps,
  render: CompetitionStructureRender,
}
