/**
 * AwardsSection — render function and types.
 * Server-safe: no client-only imports.
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
      badges: [
        { icon: null, label: 'Champion', sublabel: '' },
        { icon: null, label: 'Second Place', sublabel: '' },
        { icon: null, label: 'Third Place', sublabel: '' },
        { icon: null, label: 'Honor', sublabel: '' },
        { icon: null, label: 'Merit', sublabel: '' },
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

export function AwardsSectionRender({
  heading, introText, groups, specialAwards, noteText, noteIcon,
}: AwardsSectionProps) {
  return (
    <section style={{ paddingTop: '39px', paddingBottom: '39px' }}>
      <div className="max-w-[940px] mx-auto px-4 md:px-0">
        <h2
          className="font-poppins text-center"
          style={{ fontSize: '26px', lineHeight: '35px' }}
        >
          {heading}
        </h2>
        <div className="text-center">{introText}</div>

        {groups.map((group, gi) => (
          <div
            key={gi}
            className="rounded-[20px] mt-[30px] p-5"
            style={{
              backgroundColor: '#fcfcfc',
              boxShadow: '4px 4px 6px 3px #0003',
            }}
          >
            <div
              className="text-center mb-[6px] font-poppins font-bold"
              style={{ fontSize: '20px', lineHeight: '25px' }}
            >
              {group.roundTitle}
            </div>
            <div className="text-center">{group.subtitle}</div>

            {/* Badge grid — 5 columns on desktop */}
            <div
              className="grid grid-cols-2 md:grid-cols-5 mt-5 mb-5"
              style={{ gap: '19px' }}
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

          </div>
        ))}

        {/* Special Awards — outside the groups loop */}
        {specialAwards.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 inline-grid"
            style={{ gap: '16px' }}
          >
            {specialAwards.map((award, ai) => (
              <div
                key={ai}
                className="rounded-[20px] p-[15px]"
                style={{ backgroundColor: '#fff5e5' }}
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
                    className="font-poppins font-semibold"
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

        {/* Note */}
        {noteText && (
          <div
            className="flex items-start mt-[14px] rounded-[20px] p-[15px]"
            style={{ backgroundColor: '#f6eeee', gap: '7px' }}
          >
            {noteIcon?.url && <img src={noteIcon.url} alt="" />}
            <div>
              <div
                className="font-poppins font-medium"
                style={{ color: '#850c10', fontSize: '17px', lineHeight: '22px' }}
              >
                Note
              </div>
              <div className="mt-[6px]">{noteText}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
