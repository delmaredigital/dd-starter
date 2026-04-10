/**
 * DeadlineTable — render function and types.
 * Server-safe: no client-only imports.
 *
 * Figma: stacked tier cards with watermark icon, full-width CTA.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, safeHex } from './shared'

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
  primaryColor: string
}

export const defaultProps: DeadlineTableProps = {
  heading: 'Registration Deadlines and Participation Fees',
  tiers: [
    { title: 'Priority Deadline', deadline: 'January 5, 2026', fee: 'US$30 per student', variant: 'priority' },
    { title: 'Regular Deadline', deadline: 'February 19, 2026', fee: 'US$40 per student', variant: 'regular' },
    { title: 'Late Deadline', deadline: 'March 5, 2026', fee: 'US$50 per student', variant: 'late' },
  ],
  featureImage: null,
  ctaText: 'REGISTER NOW!',
  ctaLink: '#',
  primaryColor: '#a31f35',
}

const TIER_WATERMARKS: Record<string, string> = {
  priority: '/competition-assets/priority.svg',
  regular: '/competition-assets/regular.svg',
  late: '/competition-assets/late.svg',
}

export function DeadlineTableRender({
  heading, tiers, featureImage, ctaText, ctaLink, primaryColor,
}: DeadlineTableProps) {
  const color = safeHex(primaryColor)

  return (
    <section className="py-10">
      <div className="max-w-[940px] mx-auto px-5 lg:px-0">
        <h2
          className="font-bold mb-8 text-3xl leading-tight text-[#222]"
        >
          {heading}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6 lg:gap-10">
          <div className="flex flex-col gap-5">
            {tiers.map((tier, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl bg-[#eaf2ff] px-8 py-6"
              >
                <img
                  src={TIER_WATERMARKS[tier.variant] || TIER_WATERMARKS.priority}
                  alt=""
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-28 h-28 object-contain pointer-events-none"
                />
                <div className="relative z-10">
                  <div className="font-bold text-lg leading-[1.3]" style={{ color }}>{tier.title}</div>
                  <p className="text-[15px] leading-[1.4] mt-3 mb-0 text-[#222]">
                    <strong>Deadline: </strong>{tier.deadline}
                  </p>
                  <p className="text-[15px] leading-[1.4] mt-3 mb-0 text-[#222]">
                    <strong>Fees: </strong>{tier.fee}
                  </p>
                </div>
              </div>
            ))}

            <CompetitionCTA text={ctaText} href={ctaLink} bgColor={color} textColor="#ffffff" fullWidth />
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
