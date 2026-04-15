/**
 * SummaryGrid — render function and types.
 * Server-safe: no client-only imports.
 *
 * 3×2 feature grid. Each card: icon box + title inline, description below.
 * Figma source: node 6373:7310
 */
import { BRAND_DARK, SURFACE_GREY } from './shared'
import { iconMap } from './icons'

export interface SummaryCard {
  iconName: string
  title: string
  description: string
}

export interface SummaryGridProps {
  heading: string
  cards: SummaryCard[]
}

export const defaultProps: SummaryGridProps = {
  heading: 'Summary',
  cards: [
    { iconName: 'License', title: 'Preliminary Round', description: 'Online challenge with multiple choice and fill-in the blank questions' },
    { iconName: 'RewardedAds', title: 'Semi-Final Round', description: 'Present science solution through recorded video' },
    { iconName: 'SportsScore', title: 'Final Round', description: 'Present science solution live on zoom' },
    { iconName: 'Groups', title: 'Team Size', description: '2-5 students from the same school' },
    { iconName: 'EventList', title: 'Age categories', description: 'Middle School (Grades 6-8) and High School (Grades 9-12)' },
    { iconName: 'Public', title: 'World STEM League', description: 'Option to participate in World STEM League' },
  ],
}

export function SummaryGridRender({
  heading: headingRaw, cards,
}: SummaryGridProps) {
  const heading = headingRaw || defaultProps.heading
  return (
    <section className="py-5 md:py-10">
      <div className="max-w-5xl mx-auto px-5 lg:px-0">
        <h2 className="text-3xl font-bold leading-[1.3] text-[#222] mb-5">
          {heading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <div key={i}>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg" style={{ backgroundColor: SURFACE_GREY }}>
                  {iconMap[card.iconName] && (() => {
                    const Icon = iconMap[card.iconName]!
                    return <Icon className="w-6 h-6" style={{ color: BRAND_DARK }} />
                  })()}
                </div>
                <span
                  className="font-bold text-lg leading-7 capitalize tracking-[0.02em]"
                  style={{ color: BRAND_DARK }}
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
