/**
 * DeadlineTable — render function and types.
 * Server-safe: no client-only imports.
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
  heading: 'Registration Deadlines and Fees',
  tiers: [
    { title: 'Priority Deadline', deadline: 'January 5, 2026', fee: 'US$30 per student', variant: 'priority' },
    { title: 'Regular Deadline', deadline: 'February 19, 2026', fee: 'US$40 per student', variant: 'regular' },
    { title: 'Late Deadline', deadline: 'March 5, 2026', fee: 'US$50 per student', variant: 'late' },
  ],
  featureImage: null,
  ctaText: 'Competition Portal',
  ctaLink: '/portal',
  primaryColor: '#a31f35',
}

function getTierStyles(variant: string, primaryColor: string) {
  const color = safeHex(primaryColor)
  switch (variant) {
    case 'priority':
      return {
        bg: color,
        bgImage: '/competition-assets/priority.svg',
        titleColor: '#ffffff',
        textColor: '#ffffff',
      }
    case 'regular':
      return {
        bg: '#ff9faf6e',
        bgImage: '/competition-assets/regular.svg',
        titleColor: color,
        textColor: '#000000',
      }
    case 'late':
      return {
        bg: '#ffffff',
        bgImage: '/competition-assets/late.svg',
        titleColor: '#000000',
        textColor: '#000000',
      }
    default:
      return {
        bg: color,
        bgImage: '/competition-assets/priority.svg',
        titleColor: '#ffffff',
        textColor: '#ffffff',
      }
  }
}

export function DeadlineTableRender({
  heading, tiers, featureImage, ctaText, ctaLink, primaryColor,
}: DeadlineTableProps) {
  const color = safeHex(primaryColor)

  return (
    <section style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="max-w-[940px] mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '40px' }}>
          {/* Left column: heading + tiers + CTA */}
          <div className="flex flex-col items-stretch">
            <h2
              className="mb-5"
              style={{ fontSize: '26px', lineHeight: '35px' }}
            >
              {heading}
            </h2>

            {tiers.map((tier, i) => {
              const styles = getTierStyles(tier.variant, primaryColor)
              return (
                <div
                  key={i}
                  className="mb-[15px]"
                  style={{
                    backgroundColor: styles.bg,
                    backgroundImage: `url(${styles.bgImage})`,
                    backgroundPosition: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'auto',
                    padding: '20px 30px',
                  }}
                >
                  <div
                    className="font-bold"
                    style={{
                      color: styles.titleColor,
                      fontSize: '22px',
                      lineHeight: '30px',
                    }}
                  >
                    {tier.title}
                  </div>
                  <div
                    className="mt-[18px] mb-0"
                    style={{
                      color: styles.textColor,
                      fontSize: '15px',
                      lineHeight: '24px',
                    }}
                  >
                    <strong>Deadline: </strong>{tier.deadline}
                  </div>
                  <div
                    className="mt-[18px] mb-0"
                    style={{
                      color: styles.textColor,
                      fontSize: '15px',
                      lineHeight: '24px',
                    }}
                  >
                    <strong>Fees: </strong>{tier.fee}
                  </div>
                </div>
              )
            })}

            <div className="mt-2">
              <CompetitionCTA text={ctaText} href={ctaLink} bgColor={color} textColor="#ffffff" />
            </div>
          </div>

          {/* Right column: image */}
          <div className="flex justify-center items-center">
            {featureImage?.url && (
              <img src={featureImage.url} alt={featureImage.alt || ''} className="w-auto max-w-full h-auto" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
