/**
 * DeadlineTable — render function and types.
 * Server-safe: no client-only imports.
 *
 * Figma: stacked tier cards with watermark icon, full-width CTA.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, BRAND_DARK, CTA_BG, CTA_TEXT, TINT_FALLBACK_CLASS } from './shared'

export interface TierItem {
  title: string
  deadline: string
  fee: string
  variant: 'priority' | 'regular' | 'late'
}

export interface DeadlineTableProps {
  heading: string
  tiers: TierItem[]
  featureImage: MediaReference | null
  ctaText: string
  ctaLink: string
}

export const defaultProps: DeadlineTableProps = {
  heading: 'Registration Deadlines and Participation Fees',
  tiers: [
    { title: 'Priority Deadline', deadline: '{{Date}}', fee: 'US$ 35/student', variant: 'priority' },
    { title: 'Regular Deadline', deadline: '{{Date}}', fee: 'US$ 45/student', variant: 'regular' },
    { title: 'Late Deadline', deadline: '{{Date}}', fee: 'US$ 55/student', variant: 'late' },
  ],
  featureImage: null,
  ctaText: 'REGISTER NOW!',
  ctaLink: '#',
}

const TIER_WATERMARKS: Record<string, string> = {
  priority: '/competition-assets/priority.png',
  regular: '/competition-assets/regular.png',
  late: '/competition-assets/late.png',
}

export function DeadlineTableRender({
  heading: headingRaw, tiers, featureImage, ctaText, ctaLink,
}: DeadlineTableProps) {
  const heading = headingRaw || defaultProps.heading
  const color = BRAND_DARK

  return (
    <section className="py-5 md:py-10">
      <div className="max-w-6xl mx-auto px-3 md:px-5 lg:px-0">
        <h2
          className="font-bold mb-5 md:mb-10 text-2xl md:text-3xl leading-tight text-[#222]"
        >
          {heading}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-5 lg:gap-10">
          <div className="flex flex-col gap-5">
            {tiers.map((tier, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-xl ${TINT_FALLBACK_CLASS}`}
                style={{ backgroundColor: `color-mix(in srgb, ${color} 10%, white)` }}
              >
                {/* Watermark — Figma ~115 CSS px, snapped to w-28 (112).
                    PNG has rotation (4.65°) and fade baked into the
                    exported pixels, so CSS only handles position.
                    Anchored bottom-right; translated by 15%/10% of own
                    size so the image bleeds past the card edge (matches
                    Figma's crop ~15.4%/9.5%, rounded). Using translate(%)
                    keeps the bleed proportional if size changes. Padding
                    lives on the inner content div so the watermark's
                    containing block is the card's outer frame. */}
                <img
                  src={TIER_WATERMARKS[tier.variant] || TIER_WATERMARKS.priority}
                  alt=""
                  className="absolute bottom-0 right-0 w-28 h-28 object-contain pointer-events-none"
                  style={{ transform: 'translate(12%, 4%)' }}
                />
                <div className="relative z-10 px-8 py-6">
                  <div className="font-bold text-lg leading-tight" style={{ color }}>{tier.title}</div>
                  <p className="text-base mt-3 mb-0 text-[#222]">
                    <strong>Deadline: </strong>{tier.deadline}
                  </p>
                  <p className="text-base mt-3 mb-0 text-[#222]">
                    <strong>Fees: </strong>{tier.fee}
                  </p>
                </div>
              </div>
            ))}

            <CompetitionCTA text={ctaText} href={ctaLink} bgColor={CTA_BG} textColor={CTA_TEXT} fullWidth />
          </div>

          {featureImage?.url && (
            <div className="flex items-center justify-center">
              <img src={featureImage.url} alt={featureImage.alt || ''} className="max-w-full h-auto" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
