/**
 * CompetitionFormat — render function and types.
 * Server-safe: no client-only imports.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, safeHex } from './shared'

export interface FormatBullet {
  text: string
}

export interface RoundDetail {
  title: string
  description: string
  date: string
  formatText: string
  formatBullets: FormatBullet[]
  timeAllowed: string
  times: string
}

export interface CompetitionFormatProps {
  heading: string
  formatImage: MediaReference | null
  rounds: RoundDetail[]
  ctaText: string
  ctaLink: string
  primaryColor: string
}

export const defaultProps: CompetitionFormatProps = {
  heading: 'Competition format',
  formatImage: null,
  rounds: [
    {
      title: 'Preliminary round',
      description: 'The preliminary round is open to all registered teams worldwide',
      date: 'March 7, 2026',
      formatText: '',
      formatBullets: [
        { text: 'Test (multiple choice and short questions)' },
        { text: 'Each team member will individually attempt the same set of test questions' },
        { text: 'Only the top two scores will be used to calculate the team\'s total score' },
      ],
      timeAllowed: '1 hour',
      times: 'Asia Pacific: 12:00 noon Tokyo Time\nEurope, Middle East, Africa: 9:00 am London Time\nNorth America, South America: 11:00 am New York Time',
    },
    {
      title: 'Final Round: Top 8 teams',
      description: 'The top 8 performing teams from the preliminary round in each of the Middle School and High School Categories will be invited to compete in the global final round',
      date: 'April 4, 2026',
      formatText: 'Live Zoom presentation to a panel of judges composed of professors and industry experts',
      formatBullets: [],
      timeAllowed: '',
      times: '',
    },
  ],
  ctaText: 'Competition Portal',
  ctaLink: '/portal',
  primaryColor: '#a31f35',
}

export function CompetitionFormatRender({
  heading, formatImage, rounds, ctaText, ctaLink, primaryColor,
}: CompetitionFormatProps) {
  const color = safeHex(primaryColor)

  return (
    <section style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="max-w-[940px] mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '35px' }}>
          {/* Left column: image */}
          <div className="flex justify-center items-center">
            {formatImage?.url && (
              <img src={formatImage.url} alt={formatImage.alt || ''} className="max-w-full h-auto" />
            )}
          </div>

          {/* Right column: heading + rounds + CTA */}
          <div className="flex flex-col items-stretch">
            <h2
              className="font-bold mt-0 mb-[30px]"
              style={{ fontSize: '26px', lineHeight: '35px' }}
            >
              {heading}
            </h2>

            {rounds.map((round, i) => (
              <div
                key={i}
                className="mb-[25px]"
                style={{
                  backgroundColor: '#e5e6e7',
                  backgroundImage: `url(/competition-assets/format-round${i > 0 ? '-2' : ''}.svg)`,
                  backgroundPosition: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'auto',
                  padding: '25px 30px',
                }}
              >
                <div
                  className="font-semibold mb-5"
                  style={{
                    color: '#a90733',
                    fontSize: '18px',
                    lineHeight: '24px',
                  }}
                >
                  {round.title}
                </div>

                {round.description && (
                  <p className="mt-0 mb-5">
                    <strong>Description:</strong> {round.description}
                  </p>
                )}

                {round.formatBullets && round.formatBullets.length > 0 ? (
                  <div className="mt-0 mb-5 flex">
                    <div><strong>Format:</strong></div>
                    <ul className="mb-0 pl-[30px]">
                      {round.formatBullets.map((bullet, j) => (
                        <li
                          key={j}
                          className={j < round.formatBullets.length - 1 ? 'mb-[10px]' : 'mb-0'}
                        >
                          {bullet.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : round.formatText ? (
                  <p className="mt-0 mb-5">
                    <strong>Format: </strong>{round.formatText}
                  </p>
                ) : null}

                {round.date && (
                  <p className="mb-0" style={round.timeAllowed ? { marginBottom: '10px' } : undefined}>
                    <strong>Date: </strong>{round.date}
                  </p>
                )}

                {round.timeAllowed && (
                  <p className="mt-0 mb-5">
                    <strong>Time Allowed:</strong> {round.timeAllowed}
                  </p>
                )}

                {round.times && (
                  <div className="flex items-start">
                    <div className="mr-[10px]"><strong>Time: </strong></div>
                    <ul className="m-0 pl-5">
                      {round.times.split('\n').map((time, j) => (
                        <li key={j}>{time}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            <CompetitionCTA text={ctaText} href={ctaLink} bgColor={color} textColor="#ffffff" />
          </div>
        </div>
      </div>
    </section>
  )
}
