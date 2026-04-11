/**
 * AwardsSection — render function and types.
 * Server-safe: no client-only imports.
 *
 * Figma source: node 6373:7393
 * Layout: heading + intro → default round card (2-column grid) →
 * special awards (2 fixed cards) → final round card.
 *
 * Structure is fixed per design: 2 default rounds (Preliminary + Semi-Final),
 * 1 final round, 2 special awards (Individual + Team). Badge counts per round
 * are flexible — any count wraps naturally via flex-wrap.
 *
 * 0.75× scale from Figma. See shared.tsx for typography reference.
 */
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

export type BadgeIconKey = (typeof badgeIconOptions)[number]['value'] | ''

function badgeIconUrl(key: string): string | null {
  return key ? `/competition-assets/award-${key}.png` : null
}

export interface BadgeItem {
  badgeIcon: BadgeIconKey
  label: string
  sublabel: string
}

export interface Round {
  title: string
  badges: BadgeItem[]
}

export interface FinalRound extends Round {
  subtitle: string
}

export interface SpecialAward {
  title: string
  description: string
}

export interface AwardsSectionProps {
  heading: string
  introText: string
  preliminary: Round
  semiFinal: Round
  final: FinalRound
  individualAward: SpecialAward
  teamAward: SpecialAward
  noteText: string
  noteIcon: MediaReference | null
}

export const defaultProps: AwardsSectionProps = {
  heading: 'Recognition',
  introText: 'All participants will receive a Certificate for participation',
  preliminary: {
    title: 'Preliminary Round',
    badges: [
      { badgeIcon: 'honor', label: 'Honor', sublabel: '' },
      { badgeIcon: 'merit', label: 'Merit', sublabel: '' },
      { badgeIcon: 'semi-finalist', label: 'Semi Finalist', sublabel: '' },
    ],
  },
  semiFinal: {
    title: 'Semi- Final Round',
    badges: [
      { badgeIcon: 'finalist', label: 'Finalist', sublabel: '' },
    ],
  },
  final: {
    title: 'Final Round',
    subtitle: 'Global Awards',
    badges: [
      { badgeIcon: 'champion', label: 'Global Champion', sublabel: '' },
      { badgeIcon: '1st-runner', label: 'Global 1st Runner Up', sublabel: '' },
      { badgeIcon: '2nd-runner', label: 'Global 2nd Runner Up', sublabel: '' },
    ],
  },
  individualAward: {
    title: 'Individual Category',
    description: 'Top participants will receive individual honors, even if their teams may not win any awards.',
  },
  teamAward: {
    title: 'Team category',
    description: 'Teams will be awarded based on the sum of their two highest individual scores.',
  },
  noteText: '',
  noteIcon: null,
}

// Reusable badge tile — used by all rounds (default + final)
function BadgeTile({ badge }: { badge: BadgeItem }) {
  return (
    <div className="flex flex-col items-center gap-2.5 w-32">
      {badgeIconUrl(badge.badgeIcon) && (
        <img src={badgeIconUrl(badge.badgeIcon)!} alt={badge.label} className="w-full object-contain" />
      )}
      <span className="text-xs text-center text-[#222] font-medium">{badge.label}</span>
      {badge.sublabel && <span className="text-xs text-center text-[#666]">{badge.sublabel}</span>}
    </div>
  )
}

// Special award card — icon hardcoded by type (individual/team)
function SpecialAwardCard({ iconKey, award }: { iconKey: 'individual' | 'team'; award: SpecialAward }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl bg-[#fcfcfc] p-6"
      style={{ boxShadow: '0 2px 4px -2px rgba(10,13,18,0.06), 0 4px 8px -2px rgba(10,13,18,0.1)' }}
    >
      <div className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-1 mb-3">
        <img src={`/competition-assets/icon-${iconKey}.svg`} alt="" className="w-5 h-5" />
        <span className="font-bold text-base" style={{ color: '#f28a15' }}>{award.title}</span>
      </div>
      <p className="text-xs leading-relaxed text-[#222] m-0">{award.description}</p>
    </div>
  )
}

export function AwardsSectionRender({
  heading, introText, preliminary, semiFinal, final,
  individualAward, teamAward, noteText, noteIcon,
}: AwardsSectionProps) {
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

        {/* Default round card — Preliminary + Semi-Final side by side */}
        <div className="relative overflow-hidden rounded-3xl mb-10 bg-[#fff5e5]">
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
            {/*
              md+: explicit grid [1fr | 1px divider | 1fr] × [title | badges] rows.
              Titles share row 1 (tallest wins), badges share row 2 (same Y across cols).
              Mobile: grid-cols-1 stacks, divider hidden.
              Each badges row wraps internally when half-width is insufficient.
            */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] md:grid-rows-[auto_auto] md:gap-x-8">
              <h3 className="font-bold text-lg leading-tight text-[#222] mb-6 text-center md:col-start-1 md:row-start-1">
                {preliminary.title}
              </h3>
              <h3 className="font-bold text-lg leading-tight text-[#222] mb-6 text-center md:col-start-3 md:row-start-1">
                {semiFinal.title}
              </h3>
              <div className="flex flex-wrap justify-evenly gap-4 max-w-xl mx-auto w-full md:col-start-1 md:row-start-2 md:self-center">
                {preliminary.badges.map((b, i) => <BadgeTile key={i} badge={b} />)}
              </div>
              <div className="flex flex-wrap justify-evenly gap-4 max-w-xl mx-auto w-full md:col-start-3 md:row-start-2 md:self-center">
                {semiFinal.badges.map((b, i) => <BadgeTile key={i} badge={b} />)}
              </div>
              <div className="hidden md:block md:col-start-2 md:row-span-2 my-4 bg-[#D0D4D9]" />
            </div>
          </div>
        </div>

        {/* Special Awards — fixed 2 cards (Individual + Team) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <SpecialAwardCard iconKey="individual" award={individualAward} />
          <SpecialAwardCard iconKey="team" award={teamAward} />
        </div>

        {/* Final round card */}
        <div className="relative overflow-hidden rounded-3xl mb-10 bg-[#fff5e5]">
          <img
            src="/competition-assets/award-card-bg.svg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
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
              {final.title}
            </h3>
            {final.subtitle && (
              <p className="text-xs text-center text-[#666] mb-6">{final.subtitle}</p>
            )}
            <div className="flex flex-wrap justify-evenly gap-4 w-full max-w-xl mx-auto">
              {final.badges.map((b, i) => <BadgeTile key={i} badge={b} />)}
            </div>
          </div>
        </div>

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
