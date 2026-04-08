/**
 * AwardsSection — render function and types.
 * Server-safe: no client-only imports.
 *
 * Source: section-102, div-block-304, div-block-305, div-block-307, div-block-308
 * Structure: specialAwards and note render inside the FIRST group card (source behavior).
 * Final Round groups use variant='final' for gold styling (div-block-304.final).
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'

export interface BadgeItem {
  icon: MediaReference | null
  label: string
  sublabel: string
}

export interface AwardGroup {
  roundTitle: string
  subtitle: string
  badges: BadgeItem[]
  variant: 'default' | 'final'
}

export interface SpecialAward {
  icon: MediaReference | null
  title: string
  description: string
}

export interface AwardsSectionProps {
  heading: string
  introText: string
  groups: AwardGroup[]
  specialAwards: SpecialAward[]
  noteText: string
  noteIcon: MediaReference | null
}

export const defaultProps: AwardsSectionProps = {
  heading: 'Recognition',
  introText: 'All participants will be awarded a certificate of participation. Participants will also receive their scores.',
  groups: [
    {
      roundTitle: 'Preliminary Round',
      subtitle: 'Country + Regional Awards',
      variant: 'default',
      badges: [
        { icon: null, label: 'Champion', sublabel: '' },
        { icon: null, label: 'Second Place', sublabel: '' },
        { icon: null, label: 'Third Place', sublabel: '' },
        { icon: null, label: 'Honor', sublabel: '' },
        { icon: null, label: 'Merit', sublabel: '' },
      ],
    },
    {
      roundTitle: 'Final Round',
      subtitle: 'Global Awards',
      variant: 'final',
      badges: [
        { icon: null, label: 'Global Champion', sublabel: '' },
        { icon: null, label: 'Global Second Place', sublabel: '' },
        { icon: null, label: 'Global Third Place', sublabel: '' },
        { icon: null, label: 'Global Finalists', sublabel: '(Globally ranked 4-8)' },
      ],
    },
  ],
  specialAwards: [
    { icon: null, title: 'Individual Awards', description: 'Top participants will receive individual honors, even if their teams may not win any awards.' },
    { icon: null, title: 'Team Awards', description: 'Teams will be awarded based on the sum of their two highest individual scores.' },
  ],
  noteText: '',
  noteIcon: null,
}

function getGroupCardStyle(group: AwardGroup): React.CSSProperties {
  if (group.variant === 'final') {
    return {
      backgroundColor: '#fff5e5',
      backgroundImage: 'url(/competition-assets/award-final-bg.png)',
      backgroundPosition: '50% 0',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      border: '2px solid #e5b33a',
      boxShadow: '4px 4px 6px 3px #0003',
    }
  }
  return {
    backgroundColor: '#fcfcfc',
    boxShadow: '4px 4px 6px 3px #0003',
  }
}

export function AwardsSectionRender({
  heading, introText, groups, specialAwards, noteText, noteIcon,
}: AwardsSectionProps) {
  return (
    <section style={{ paddingTop: '39px', paddingBottom: '39px' }}>
      <div className="max-w-[940px] mx-auto px-5 lg:px-0">
        <h2
          className="font-bold text-center"
          style={{ fontSize: '26px', lineHeight: '35px' }}
        >
          {heading}
        </h2>
        <div className="text-center">{introText}</div>

        {groups.map((group, gi) => (
          <div
            key={gi}
            className="rounded-[20px] mt-[30px] p-5"
            style={getGroupCardStyle(group)}
          >
            <div
              className="text-center mb-[6px] font-bold"
              style={{ fontSize: '20px', lineHeight: '25px' }}
            >
              {group.roundTitle}
            </div>
            <div className="text-center">{group.subtitle}</div>

            {/* Badge grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] mt-5 mb-5"
              style={{ gap: '20px' }}
            >
              {group.badges.map((badge, bi) => (
                <div key={bi} className="flex flex-col justify-center items-center">
                  {badge.icon?.url && (
                    <img src={badge.icon.url} alt={badge.icon.alt || ''} style={{ width: '122px' }} />
                  )}
                  <div
                    className="self-center mt-[10px]"
                    style={{ fontSize: '16px', lineHeight: '25px' }}
                  >
                    {badge.label}
                  </div>
                  {badge.sublabel && (
                    <div className="text-center text-sm">{badge.sublabel}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Special Awards + Note render inside the FIRST group card (source div-block-305, div-block-308) */}
            {gi === 0 && specialAwards.length > 0 && (
              <div
                className="grid grid-cols-1 md:grid-cols-2 inline-grid"
                style={{ gap: '16px' }}
              >
                {specialAwards.map((award, ai) => (
                  <div
                    key={ai}
                    className="rounded-[20px] p-[15px]"
                    style={{
                      backgroundColor: '#fff5e5',
                      backgroundImage: ai === 0 ? 'url(/competition-assets/award-individual-bg.svg)' : ai === 1 ? 'url(/competition-assets/award-team-bg.svg)' : undefined,
                      backgroundPosition: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'auto',
                    }}
                  >
                    <div
                      className="rounded-[20px] inline-flex items-center mb-[10px]"
                      style={{
                        backgroundColor: '#ffffff',
                        padding: '5px 10px',
                        gap: '10px',
                      }}
                    >
                      {award.icon?.url && <img src={award.icon.url} alt="" />}
                      <div
                        className="font-semibold"
                        style={{ color: '#f28a15', fontSize: '15px' }}
                      >
                        {award.title}
                      </div>
                    </div>
                    <div>{award.description}</div>
                  </div>
                ))}
              </div>
            )}

            {gi === 0 && noteText && (
              <div
                className="flex items-start mt-[14px] rounded-[20px] p-[15px]"
                style={{ backgroundColor: '#f6eeee', gap: '7px' }}
              >
                {noteIcon?.url && <img src={noteIcon.url} alt="" />}
                <div>
                  <div
                    className="font-medium"
                    style={{ color: '#850c10', fontSize: '17px', lineHeight: '22px' }}
                  >
                    Note
                  </div>
                  <div className="mt-[6px]" style={{ fontSize: '14px', lineHeight: '20px' }}>{noteText}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
