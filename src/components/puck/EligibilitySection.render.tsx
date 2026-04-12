/**
 * EligibilitySection — render function and types.
 * Server-safe: no client-only imports.
 *
 * Figma: intro text + vertical divider + bullet list on light bg.
 * Mobile (Harvard pattern): stacks vertically with horizontal divider.
 */
import { safeHex } from './shared'
import { usePrimaryColor } from './CompetitionColors'

export interface EligibilityItem {
  value: string
}

export interface EligibilitySectionProps {
  introText: string
  items: EligibilityItem[]
  primaryColor: string
}

export const defaultProps: EligibilitySectionProps = {
  introText: 'This challenge is for you if you\'re interested in:',
  items: [
    { value: 'You\'re interested in STEM' },
    { value: 'You want to challenge yourself and compete globally' },
    { value: 'You want to build a solid STEM profile' },
  ],
  primaryColor: '#13294C',
}

export function EligibilitySectionRender({
  introText, items, primaryColor: propColor,
}: EligibilitySectionProps) {
  const primaryColor = usePrimaryColor(propColor)
  const color = safeHex(primaryColor)

  return (
    <section className="bg-[#f2f3f0] py-8">
      <div className="max-w-5xl mx-auto px-5 lg:px-0">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <p className="text-lg leading-[1.6] text-[#222] font-medium m-0 md:w-5/12">
            {introText}
          </p>
          {/* Horizontal divider on mobile, vertical on desktop */}
          <div className="block md:hidden w-[383px] max-w-full h-[5px] my-2 rounded" style={{ backgroundColor: color }} />
          <div className="hidden md:block ml-3 rounded" style={{ width: '4px', height: '120px', backgroundColor: color }} />
          <ul className="list-disc pl-9 m-0 md:flex-1">
            {items.map((item, i) => (
              <li key={i} className="text-lg leading-[1.6] font-semibold" style={{ color }}>
                {item.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
