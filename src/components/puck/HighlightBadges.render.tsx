/**
 * HighlightBadges — render function and types.
 * Server-safe: no client-only imports.
 *
 * Figma source: node 6382:13196
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { safeHex } from './shared'

export interface BadgeItem {
  label: string
  icon: MediaReference | null
}

export interface HighlightBadgesProps {
  heading: string
  badges: BadgeItem[]
  primaryColor: string
}

export const defaultProps: HighlightBadgesProps = {
  heading: 'Step into:',
  badges: [
    { label: 'Science', icon: null },
    { label: 'Medicine', icon: null },
    { label: 'Big Ideas', icon: null },
  ],
  primaryColor: '#13294C',
}

export function HighlightBadgesRender({
  heading,
  badges,
  primaryColor,
}: HighlightBadgesProps) {
  const color = safeHex(primaryColor, '#13294C')

  return (
    <section className="py-6 px-5 lg:px-0">
      <div
        className="mx-auto max-w-[1270px] rounded-xl bg-white px-8 py-8"
        style={{
          boxShadow: '0 5px 50px rgba(62,63,65,0.08), 0 -5px 50px rgba(62,63,65,0.08)',
        }}
      >
        <p
          className="text-center text-[20px] font-medium leading-[26px] mb-6 text-[#222]"
        >
          {heading}
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap justify-evenly items-center gap-6 sm:gap-8">
          {badges.map((badge, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="flex-shrink-0 flex items-center justify-center w-[44px] h-[44px] sm:w-[53px] sm:h-[53px] rounded-full"
                style={{ border: `2px solid ${color}` }}
              >
                {badge.icon?.url && (
                  <img
                    src={badge.icon.url}
                    alt={badge.icon.alt || badge.label}
                    className="w-[22px] h-[22px] sm:w-[28px] sm:h-[28px] object-contain"
                  />
                )}
              </div>
              <span
                className="text-[18px] sm:text-[24px] font-semibold uppercase leading-[24px] sm:leading-[31px]"
                style={{ color }}
              >
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
