/**
 * AwardsSection — render function and types.
 * Server-safe: no client-only imports.
 *
 * Figma source: node 6373:7393
 * Layout: heading + intro → special award cards (2-col) → round cards
 * with bg image + decoratives + medal badges via flex.
 *
 * 0.75× scale from Figma. See shared.tsx for typography reference.
 */
import React from 'react'
import type { MediaReference } from '@delmaredigital/payload-puck/fields'

export const badgeIconOptions = [
  { label: 'Honor', value: 'honor' },
  { label: 'Merit', value: 'merit' },
  { label: 'Semi Finalist', value: 'semi-finalist' },
  { label: 'Finalist', value: 'finalist' },
  { label: 'Champion', value: 'champion' },
  { label: '1st Runner Up', value: '1st-runner' },
  { label: '2nd Runner Up', value: '2nd-runner' },
] as const

export const specialAwardIconOptions = [
  { label: 'Individual', value: 'individual' },
  { label: 'Team', value: 'team' },
] as const

export type BadgeIconKey = (typeof badgeIconOptions)[number]['value'] | ''
export type SpecialAwardIconKey = (typeof specialAwardIconOptions)[number]['value'] | ''

function badgeIconUrl(key: string): string | null {
  return key ? `/competition-assets/award-${key}.png` : null
}

function specialAwardIconUrl(key: string): string | null {
  return key ? `/competition-assets/icon-${key}.svg` : null
}

export interface BadgeItem {
  badgeIcon: BadgeIconKey
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
  awardIcon: SpecialAwardIconKey
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
  introText: 'All participants will receive a Certificate for participation',
  groups: [
    {
      roundTitle: 'Preliminary Round',
      subtitle: '',
      variant: 'default',
      badges: [
        { badgeIcon: 'honor', label: 'Honor', sublabel: '' },
        { badgeIcon: 'merit', label: 'Merit', sublabel: '' },
        { badgeIcon: 'semi-finalist', label: 'Semi Finalist', sublabel: '' },
      ],
    },
    {
      roundTitle: 'Semi- Final Round',
      subtitle: '',
      variant: 'default',
      badges: [
        { badgeIcon: 'finalist', label: 'Finalist', sublabel: '' },
      ],
    },
    {
      roundTitle: 'Final Round',
      subtitle: 'Global Awards',
      variant: 'final',
      badges: [
        { badgeIcon: 'champion', label: 'Global Champion', sublabel: '' },
        { badgeIcon: '1st-runner', label: 'Global 1st Runner Up', sublabel: '' },
        { badgeIcon: '2nd-runner', label: 'Global 2nd Runner Up', sublabel: '' },
      ],
    },
  ],
  specialAwards: [
    { awardIcon: 'individual', title: 'Individual Category', description: 'Top participants will receive individual honors, even if their teams may not win any awards.' },
    { awardIcon: 'team', title: 'Team category', description: 'Teams will be awarded based on the sum of their two highest individual scores.' },
  ],
  noteText: '',
  noteIcon: null,
}

export function AwardsSectionRender({
  heading, introText, groups, specialAwards, noteText, noteIcon,
}: AwardsSectionProps) {
  const defaultGroups = (groups ?? []).filter(g => g.variant !== 'final')
  const finalGroups = (groups ?? []).filter(g => g.variant === 'final')

  return (
    <section className="py-10">
      <div className="max-w-[940px] mx-auto px-5 lg:px-0">
        {/* Heading — Figma 40px Bold → 30px (text-3xl) */}
        <h2 className="font-bold text-3xl leading-tight text-[#222] mb-3 text-center">
          {heading}
        </h2>

        {/* Intro — Figma 20px Medium → 15px */}
        {introText && (
          <p className="text-[15px] leading-relaxed text-[#222] mb-8 text-center">
            {introText}
          </p>
        )}

        {/* Default round groups (Preliminary, Semi-Final) — before special awards per Figma */}
        {defaultGroups.length > 0 && (
          <div
            className="relative overflow-hidden rounded-3xl mb-10 bg-[#fff5e5]"
          >
            {/* Watermark pattern overlay */}
            <img
              src="/competition-assets/award-card-bg.svg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <img
              src="/competition-assets/decor-medal.svg"
              alt=""
              className="absolute pointer-events-none opacity-20"
              style={{ left: '93%', top: '48%', width: '8.6%' }}
            />
            <div className="relative z-10 py-8 px-6">
              <div className="flex flex-wrap justify-around gap-8">
                {defaultGroups.map((group, gi) => (
                  <React.Fragment key={gi}>
                  {gi > 0 && (
                    <div className="hidden lg:block self-stretch" style={{ width: '1px', backgroundColor: '#D0D4D9', marginTop: '10%', marginBottom: '10%' }} />
                  )}
                  <div className="flex flex-col items-center">
                    <h3 className="font-bold text-lg leading-tight text-[#222] mb-6 text-center">
                      {group.roundTitle}
                    </h3>
                    <div className="flex flex-wrap justify-center gap-12">
                      {group.badges.map((badge, bi) => (
                        <div key={bi} className="flex flex-col items-center gap-2.5 w-32">
                          {badgeIconUrl(badge.badgeIcon) && (
                            <img src={badgeIconUrl(badge.badgeIcon)!} alt={badge.label} className="w-full object-contain" />
                          )}
                          <span className="text-xs text-center text-[#222] font-medium">
                            {badge.label}
                          </span>
                          {badge.sublabel && (
                            <span className="text-xs text-center text-[#666]">{badge.sublabel}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Special Awards — 2-column cards (between default and final per Figma) */}
        {specialAwards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {specialAwards.map((award, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl bg-[#fcfcfc] p-6"
                style={{ boxShadow: '0 2px 4px -2px rgba(10,13,18,0.06), 0 4px 8px -2px rgba(10,13,18,0.1)' }}
              >
                <div className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-1 mb-3">
                  {specialAwardIconUrl(award.awardIcon) && (
                    <img src={specialAwardIconUrl(award.awardIcon)!} alt="" className="w-5 h-5" />
                  )}
                  <span className="font-bold text-base" style={{ color: '#f28a15' }}>
                    {award.title}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[#222] m-0">
                  {award.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Final round groups */}
        {finalGroups.map((group, gi) => (
          <div key={gi} className="relative overflow-hidden rounded-3xl mb-10 bg-[#fff5e5]">
            <img
              src="/competition-assets/award-card-bg.svg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            {/* Decoratives at Figma percentages */}
            <img
              src="/competition-assets/decor-star.svg"
              alt=""
              className="absolute pointer-events-none opacity-20"
              style={{ left: '0.3%', top: '41%', width: '7.7%' }}
            />
            <img
              src="/competition-assets/decor-trophy.svg"
              alt=""
              className="absolute pointer-events-none opacity-20"
              style={{ left: '91.3%', top: '52%', width: '10.7%' }}
            />
            <img
              src="/competition-assets/decor-medal.svg"
              alt=""
              className="absolute pointer-events-none opacity-20"
              style={{ left: '84.4%', top: '39.8%', width: '8.6%' }}
            />
            <div className="relative z-10 py-8 px-6">
              <h3 className="font-bold text-lg leading-tight text-[#222] mb-1 text-center">
                {group.roundTitle}
              </h3>
              {group.subtitle && (
                <p className="text-xs text-center text-[#666] mb-6">{group.subtitle}</p>
              )}
              <div className="flex flex-wrap justify-center gap-12">
                {group.badges.map((badge, bi) => (
                  <div key={bi} className="flex flex-col items-center gap-2.5 w-32">
                    {badgeIconUrl(badge.badgeIcon) && (
                      <img src={badgeIconUrl(badge.badgeIcon)!} alt={badge.label} className="w-full object-contain" />
                    )}
                    <span className="text-xs text-center text-[#222] font-medium">
                      {badge.label}
                    </span>
                    {badge.sublabel && (
                      <span className="text-xs text-center text-[#666]">{badge.sublabel}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Note */}
        {noteText && (
          <div className="flex items-start gap-2 rounded-xl bg-[#f6eeee] p-4">
            {noteIcon?.url && <img src={noteIcon.url} alt="" className="w-6 h-6" />}
            <div>
              <div className="font-medium text-sm" style={{ color: '#850c10' }}>Note</div>
              <div className="text-xs leading-relaxed mt-1">{noteText}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
