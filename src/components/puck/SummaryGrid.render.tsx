/**
 * SummaryGrid — render function and types.
 * Server-safe: no client-only imports.
 *
 * 6-column icon grid with competition overview cards.
 * Reference: docs/reference/webflow/harvard-quiz-bowl.html section.section-85
 * Source CSS: .section-85, .heading-131
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { safeHex } from './shared'

export interface SummaryCard {
  icon: MediaReference | null
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
    { icon: null, title: 'Preliminary Round', description: 'Online test with multiple choice and short answer questions' },
    { icon: null, title: 'Semi-Final Round', description: 'Live rapid-fire questions via Zoom' },
    { icon: null, title: 'Final Round', description: 'Live rapid-fire questions via Zoom' },
    { icon: null, title: 'Team Size', description: '2-5 students from the same school' },
    { icon: null, title: 'Age Categories', description: 'K-G2, G3-G5, G6-G8, G9-G12' },
    { icon: null, title: 'Six Quiz Categories', description: 'Choose to participate in one or more categories' },
  ],
  primaryColor: '#850c10',
}

export function SummaryGridRender({
  heading, cards, primaryColor,
}: SummaryGridProps) {
  return (
    <section style={{ marginTop: '50px', marginBottom: '50px' }}>
      <div className="max-w-[940px] mx-auto px-4 md:px-0">
        <h2
          className="font-bold text-center"
          style={{ fontSize: '28px', color: '#3a3a3b', lineHeight: '22px', marginBottom: '19px' }}
        >
          {heading}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {cards.map((card, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              {card.icon?.url && (
                <img src={card.icon.url} alt={card.icon.alt || ''} className="w-16 h-16 mb-3" />
              )}
              <div
                className="font-semibold mb-1"
                style={{ fontSize: '16px', lineHeight: '25px', color: safeHex(primaryColor) }}
              >
                {card.title}
              </div>
              <p style={{ fontSize: '14px', color: '#3a3a3b', marginTop: '7px', marginBottom: 0 }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
