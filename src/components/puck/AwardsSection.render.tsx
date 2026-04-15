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
import { RichText } from './shared'

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
  introText: '<p>All participants will receive a <strong>Certificate</strong> for participation</p>',
  preliminary: {
    title: 'Preliminary Round',
    badges: [
      { badgeIcon: 'honor', label: 'Honor', sublabel: '' },
      { badgeIcon: 'merit', label: 'Merit', sublabel: '' },
    ],
  },
  semiFinal: {
    title: 'Semi- Final Round',
    badges: [
      { badgeIcon: 'semi-finalist', label: 'Semi Finalist', sublabel: '' },
    ],
  },
  final: {
    title: 'Final Round',
    subtitle: '',
    badges: [
      { badgeIcon: 'champion', label: 'Global Champion', sublabel: '' },
      { badgeIcon: '1st-runner', label: 'Global 1st Runner Up', sublabel: '' },
      { badgeIcon: '2nd-runner', label: 'Global 2nd Runner Up', sublabel: '' },
      { badgeIcon: 'finalist', label: 'Finalist', sublabel: '' },
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

// Reusable badge tile — used by all rounds (default + final).
// Image has fixed width (105px ≈ Figma wreath 140 × 0.75).
// Tile uses w-max + min-w-[105px]: width shrinks to content but never below
// the image. Short labels ("Honor") keep tile ≈ 105px; long labels
// ("Global 2nd Runner Up", with whitespace-nowrap) stretch the tile to fit
// on one line. Matches Figma default (w=140 tile) vs final (w=175 tile)
// behavior without needing two variants.
function BadgeTile({ badge }: { badge: BadgeItem }) {
  return (
    <div className="flex w-max min-w-[105px] shrink-0 flex-col items-center gap-2.5">
      {badgeIconUrl(badge.badgeIcon) && (
        <img src={badgeIconUrl(badge.badgeIcon)!} alt={badge.label} className="block w-[105px]" />
      )}
      <span className="text-xs text-center whitespace-nowrap text-[#222] font-medium">{badge.label}</span>
      {badge.sublabel && <span className="text-xs text-center whitespace-nowrap text-[#666]">{badge.sublabel}</span>}
    </div>
  )
}

// Special award card — icon hardcoded by type (individual/team).
// Decoration (cup watermark) is positioned content-centered within Figma's
// boolean-op bounds. SVGs are cropped to visible pixels; percentages reflect
// the SVG's content size, not the bounding box.
function SpecialAwardCard({ iconKey, award }: { iconKey: 'individual' | 'team'; award: SpecialAward }) {
  // Individual decor (80×88 SVG in 92.34×93.22 bounds on 637×144 card)
  // Team decor       (112×105 SVG in 127.52×114.63 bounds on 638×144 card)
  const decor = iconKey === 'individual'
    ? { left: '88.72%', top: '56.50%', width: '12.56%' }
    : { left: '86.13%', top: '38.07%', width: '17.55%' }
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-[#fcfcfc] py-3.5 pl-3.5 ${iconKey === 'individual' ? 'pr-16' : 'pr-20'}`}
      style={{ boxShadow: '0 2px 4px -2px rgba(10,13,18,0.06), 0 4px 8px -2px rgba(10,13,18,0.1)' }}
    >
      <img
        src={`/competition-assets/decor-special-${iconKey}.svg`}
        alt=""
        className="absolute pointer-events-none"
        style={decor}
      />
      <div className="relative inline-flex items-center gap-2 bg-white rounded-full px-3 py-1 mb-2.5">
        <img src={`/competition-assets/icon-${iconKey}.svg`} alt="" className="w-5 h-5" />
        <span className="font-bold text-xs" style={{ color: '#f28a15' }}>{award.title}</span>
      </div>
      <p className="relative text-xs leading-relaxed text-[#222] m-0">{award.description}</p>
    </div>
  )
}

export function AwardsSectionRender({
  heading: headingRaw,
  introText,
  preliminary = defaultProps.preliminary,
  semiFinal = defaultProps.semiFinal,
  final = defaultProps.final,
  individualAward = defaultProps.individualAward,
  teamAward = defaultProps.teamAward,
  noteText, noteIcon,
}: AwardsSectionProps) {
  console.log('[AwardsSection] introText:', typeof introText, introText)
  const heading = headingRaw || defaultProps.heading
  return (
    <section className="py-5 md:py-10">
      <div className="max-w-[960px] mx-auto px-5 lg:px-0">
        {/* Heading — Figma 40px Bold → 30px (text-3xl) */}
        <h2 className="font-bold text-3xl leading-tight text-[#222] mb-3 text-center">
          {heading}
        </h2>

        {/* Intro — Figma 20px Medium → 15px, supports rich text (e.g. <strong>) */}
        {introText && (
          <RichText className="text-[15px] leading-relaxed text-[#222] mb-5 text-center">{introText}</RichText>
        )}

        {/* Default round card — Preliminary + Semi-Final side by side */}
        <div className="relative overflow-hidden rounded-2xl mb-4 bg-[#fff5e5]">
          <img
            src="/competition-assets/award-card-bg.svg"
            alt=""
            className="absolute top-0 left-0 origin-top-left pointer-events-none"
            style={{ transform: 'scale(1.1)' }}
          />
          {/*
            Decoration positions: SVGs are Figma-cropped to visible star pixels
            (smaller than Figma's rotation bounding box). Width % uses SVG viewBox
            width (not rotation bounds). Position uses rotation bounds top-left +
            SVG mask x/y offset — reads exact placement from the SVG's own data.
          */}
          <img
            src="/competition-assets/decor-medal.svg"
            alt=""
            className="absolute pointer-events-none"
            style={{ left: '94.79%', top: '54.35%', width: '5.06%' }}
          />
          <div className="relative z-10 py-8 px-6">
            {/*
              md+: explicit grid [1fr | 1px divider | 1fr] × [title | badges] rows.
              Titles share row 1 (tallest wins), badges share row 2 (same Y across cols).
              Mobile: grid-cols-1 stacks, divider hidden.
              Each badges row wraps internally when half-width is insufficient.
            */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] md:grid-rows-[auto_auto] md:gap-x-8 gap-y-6 md:gap-y-0">
              {/* DOM order: title+badges pairs so mobile (single-col) flows
                 title1 → badges1 → title2 → badges2. Desktop uses explicit
                 col-start/row-start so DOM order doesn't affect layout. */}
              <h3 className="font-bold text-lg leading-tight text-[#222] md:mb-6 text-center md:col-start-1 md:row-start-1">
                {preliminary.title}
              </h3>
              {/* Mobile: even badge count → 2-per-row grid, odd → single column. sm+ reverts to flex row. */}
              <div className={`${preliminary.badges.length % 2 === 0 ? 'grid grid-cols-2 justify-items-center' : 'flex flex-col items-center'} gap-4 max-w-xl mx-auto w-full sm:flex sm:flex-row sm:flex-wrap sm:justify-evenly md:col-start-1 md:row-start-2 md:self-center`}>
                {preliminary.badges.map((b, i) => <BadgeTile key={i} badge={b} />)}
              </div>
              <h3 className="font-bold text-lg leading-tight text-[#222] md:mb-6 text-center md:col-start-3 md:row-start-1">
                {semiFinal.title}
              </h3>
              <div className={`${semiFinal.badges.length % 2 === 0 ? 'grid grid-cols-2 justify-items-center' : 'flex flex-col items-center'} gap-4 max-w-xl mx-auto w-full sm:flex sm:flex-row sm:flex-wrap sm:justify-evenly md:col-start-3 md:row-start-2 md:self-center`}>
                {semiFinal.badges.map((b, i) => <BadgeTile key={i} badge={b} />)}
              </div>
              <div className="hidden md:block md:col-start-2 md:row-span-2 my-4 bg-gray-300" />
            </div>
          </div>
        </div>

        {/* Special Awards — fixed 2 cards (Individual + Team) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <SpecialAwardCard iconKey="individual" award={individualAward} />
          <SpecialAwardCard iconKey="team" award={teamAward} />
        </div>

        {/* Final round card */}
        <div className="relative overflow-hidden rounded-2xl mb-10 bg-[#fff5e5]">
          <img
            src="/competition-assets/award-card-bg.svg"
            alt=""
            className="absolute top-0 left-0 origin-top-left pointer-events-none"
            style={{ transform: 'scale(1.1)' }}
          />
          {/* Decoration positions: see note on default card above. */}
          <img
            src="/competition-assets/decor-star.svg"
            alt=""
            className="absolute pointer-events-none"
            style={{ left: '1.46%', top: '45.86%', width: '5.67%' }}
          />
          <img
            src="/competition-assets/decor-trophy.svg"
            alt=""
            className="absolute pointer-events-none"
            style={{ left: '93.84%', top: '60.69%', width: '6.51%' }}
          />
          <img
            src="/competition-assets/decor-medal.svg"
            alt=""
            className="absolute pointer-events-none"
            style={{ left: '86.13%', top: '46.62%', width: '5.06%' }}
          />
          <div className="relative z-10 py-8 px-6">
            <div className="flex flex-col items-center gap-1 mb-6">
              <h3 className="font-bold text-lg leading-tight text-[#222] text-center">
                {final.title}
              </h3>
              {final.subtitle && (
                <p className="text-xs text-center text-[#666]">{final.subtitle}</p>
              )}
            </div>
            <div className={`${final.badges.length % 2 === 0 ? 'grid grid-cols-2 justify-items-center' : 'flex flex-col items-center'} gap-4 w-full max-w-xl mx-auto sm:flex sm:flex-row sm:flex-wrap sm:justify-evenly`}>
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
