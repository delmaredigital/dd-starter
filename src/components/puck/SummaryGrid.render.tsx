/**
 * SummaryGrid — render function and types.
 * Server-safe: no client-only imports.
 *
 * 3×2 feature grid. Each card: icon box + title inline, description below.
 * Figma source: node 6373:7310
 */
import { safeHex } from './shared'
import { usePrimaryColor } from './CompetitionColors'
import { iconMap } from './icons'

export interface SummaryCard {
  iconName: string
  title: string
  description: string
}

export interface SummaryGridProps {
  heading: string
  cards: SummaryCard[]
  primaryColor: string
}

export const defaultProps: SummaryGridProps = {
  heading: 'Summary',
  cards: [
    { iconName: 'License', title: 'Preliminary Round', description: 'Online test with multiple choice and short answer questions' },
    { iconName: 'RewardedAds', title: 'Semi-Final Round', description: 'Live rapid-fire questions via Zoom' },
    { iconName: 'SportsScore', title: 'Final Round', description: 'Live rapid-fire questions via Zoom' },
    { iconName: 'Groups', title: 'Team Size', description: '2-5 students from the same school' },
    { iconName: 'EventList', title: 'Age Categories', description: 'K-G2, G3-G5, G6-G8, G9-G12' },
    { iconName: 'Public', title: 'Six Quiz Categories', description: 'Choose to participate in one or more categories' },
  ],
  primaryColor: '#850c10',
}

export function SummaryGridRender({
  heading, cards, primaryColor: propColor,
}: SummaryGridProps) {
  const primaryColor = usePrimaryColor(propColor)
  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-5 lg:px-0">
        <h2 className="text-3xl font-bold leading-[1.3] text-[#222] mb-5">
          {heading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <div key={i}>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-[#f2f3f0]">
                  {iconMap[card.iconName] && (() => {
                    const Icon = iconMap[card.iconName]!
                    return <Icon className="w-6 h-6" style={{ color: safeHex(primaryColor) }} />
                  })()}
                </div>
                <span
                  className="font-bold text-lg leading-7 capitalize tracking-[0.02em]"
                  style={{ color: safeHex(primaryColor) }}
                >
                  {card.title}
                </span>
              </div>
              <p className="text-[15px] text-[#222] m-0">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
