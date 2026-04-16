/**
 * EligibilitySection — render function and types.
 * Server-safe: no client-only imports.
 *
 * Figma: intro text + vertical divider + bullet list on light bg.
 * Mobile (Harvard pattern): stacks vertically with horizontal divider.
 */
import { BRAND_DARK, SURFACE_GREY } from './shared'

export interface EligibilityItem {
  value: string
}

export interface EligibilitySectionProps {
  introText: string
  items: EligibilityItem[]
}

export const defaultProps: EligibilitySectionProps = {
  introText: 'This challenge is for you if you\'re interested in:',
  items: [
    { value: 'You\'re interested in STEM' },
    { value: 'You want to challenge yourself and compete globally' },
    { value: 'You want to build a solid STEM profile' },
  ],
}

export function EligibilitySectionRender({
  introText, items,
}: EligibilitySectionProps) {
  const color = BRAND_DARK

  return (
    <section className="py-5 md:py-10" style={{ backgroundColor: SURFACE_GREY }}>
      <div className="max-w-5xl mx-auto px-3 md:px-5 lg:px-0">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-6">
          <p className="text-lg leading-relaxed text-[#222] font-medium m-0 md:w-5/12">
            {introText}
          </p>
          {/* Horizontal divider on mobile, vertical on desktop */}
          <div className="block md:hidden w-[383px] max-w-full h-[5px] my-2 rounded" style={{ backgroundColor: color }} />
          <div className="hidden md:block ml-3 rounded" style={{ width: '4px', height: '120px', backgroundColor: color }} />
          <ul className="list-disc pl-9 m-0 md:flex-1">
            {items.map((item, i) => (
              <li key={i} className="text-lg leading-relaxed font-semibold" style={{ color }}>
                {item.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
