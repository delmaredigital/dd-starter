/**
 * CompetitionFormatV2 — "Competition format" detailed per-round breakdown.
 * Server-safe: no client-only imports.
 *
 * Figma source: file gsQOnwzRxVZA3Q6MMY1bnv, UNC frame 6272:33298
 * Heading 6373:7167, content group 6392:24223
 * Round cards: 6392:24224 (prelim), 6392:24225 (semi), 6392:24226 (final)
 *
 * Layout: heading → stacked round cards (light blue bg) each with title,
 * description, date, optional info cards, format section, category detail
 * cards, bullets, and body text → dual CTA buttons.
 *
 * 0.75× scale from Figma 1728px → 940px container, snapped to Tailwind stock.
 *
 * Round card bg: rgb(234,242,255), corners 16→12px = rounded-xl
 * Inner detail cards: white bg, corners 14→10.5px = rounded-xl
 */
import { CompetitionCTA, RichText, BRAND_DARK, TINT_FALLBACK_CLASS } from './shared'
import { CalendarToday } from './icons'

/* ── Types ──────────────────────────────────────────────── */

export interface DetailCard {
  heading: string
  body: string
}

export interface FormatRound {
  title: string
  description: string
  dateLabel: string
  infoCards: DetailCard[]
  formatDetails: string
  formatCards: DetailCard[]
  body: string
}

export interface CompetitionFormatV2Props {
  heading: string
  rounds: FormatRound[]
  ctaText: string
  ctaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
}

/* ── Defaults ───────────────────────────────────────────── */

export const defaultProps: CompetitionFormatV2Props = {
  heading: 'Competition format',
  rounds: [
    {
      title: 'Preliminary round: Online Challenge',
      description:
        'The preliminary round is open to all registered teams worldwide',
      dateLabel: 'March 20, 2027',
      infoCards: [
        {
          heading: 'Time',
          body: '<ul><li>Asia Pacific: 12:00 noon Tokyo Time</li><li>Europe, Middle East, Africa: 9:00 am London Time</li><li>North America, South America: 11:00 am New York Time</li></ul>',
        },
        {
          heading: 'Duration',
          body: '<ul><li>Lower Primary School Category: 45 minutes</li><li>Upper Primary School Category: 1 hour</li></ul>',
        },
      ],
      formatDetails: '<ul><li>Online challenge (multiple choice, fill in the blanks, and free-response questions)</li></ul>',
      formatCards: [
        {
          heading: 'Lower Primary School Category (Grades K\u20132):',
          body: 'Focuses on number awareness and foundational math concepts, along with simple logic questions that develop early reasoning skills.',
        },
        {
          heading: 'Upper Primary School Category (Grades 3\u20135):',
          body: 'Based on math and science concepts students are learning in school, combined with logic problems that build confidence and problem-solving skills.',
        },
      ],
      body: '<ul><li>Each team member will individually attempt the same set of challenge</li><li>The top two scores will be used to calculate the team\u2019s total score</li></ul>',
    },
    {
      title: 'Semi-final round: Poster / video',
      description:
        'The top 3 performing teams from each grade level in the preliminary round (18 teams in total) will be invited to compete in the global semi-final round',
      dateLabel: 'Deadline: 11:59pm Eastern Time (New York Time), April 3, 2027',
      infoCards: [],
      formatDetails: '',
      formatCards: [
        {
          heading: 'Lower Primary School Category (Grades K\u20132):',
          body: 'Semi-finalist teams will have one week to create a poster with a solution to a science problem.',
        },
        {
          heading: 'Upper Primary School Category (Grades 3\u20135):',
          body: 'Semi-finalist teams will have one week to develop a solution to a science problem and present their work through a recorded 5-minute video.',
        },
      ],
      body: '',
    },
    {
      title: 'Final round: live Zoom presentation',
      description:
        'The top 5 performing team from the preliminary round in each of the Lower Primary and Upper Primary Categories will be invited to compete in the global final round',
      dateLabel: 'April 24, 2027 10:00am Eastern Time (New York Time)',
      infoCards: [],
      formatDetails: '',
      formatCards: [],
      body: 'Finalist teams will have one week to refine and improve their solutions from the semi-final round based on judges\u2019 feedback, and present their final solution to a <strong>judging panel</strong> composed of <strong>UNC Medical Brigades students.</strong>',
    },
  ],
  ctaText: 'Register Now!',
  ctaLink: '/register',
  secondaryCtaText: 'Join the league',
  secondaryCtaLink: '/league',
}

/* ── Render ──────────────────────────────────────────────── */

export function CompetitionFormatV2Render({
  heading: headingRaw,
  rounds: rawRounds,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
}: CompetitionFormatV2Props) {
  const heading = headingRaw || defaultProps.heading
  const color = BRAND_DARK
  const rounds = rawRounds ?? []

  return (
    <section className="py-5 md:py-10">
      <div className="max-w-5xl mx-auto px-2.5 md:px-5 lg:px-0">
        {/* Heading — Figma 40px Bold #222 → 0.75× 30px. Gap to first card: 48→36px ≈ mb-9 */}
        <h2
          className="font-bold text-center mb-5 md:mb-9"
          style={{ fontSize: '30px', lineHeight: '1.3', color: '#222' }}
        >
          {heading}
        </h2>

        {/* Round cards */}
        {rounds.map((round, i) => (
          <div
            key={`format-round-${round.title}-${i}`}
            className={`rounded-xl px-5 py-4 md:px-12 md:py-7 ${TINT_FALLBACK_CLASS} ${i > 0 ? 'mt-6 md:mt-12' : ''}`}
            style={{ backgroundColor: `color-mix(in srgb, ${color} 10%, white)` }}
          >
            {/* Round title — Figma 26px Bold primaryColor, leading-normal → 0.75× 20px = text-xl */}
            <h3
              className="font-bold mt-0 mb-2 text-xl leading-normal"
              style={{ color }}
            >
              {round.title}
            </h3>

            {/* Description — Figma 20px Regular #222, leading 34px (1.7) → 0.75× 15px */}
            {round.description && (
              <p className="mt-0 mb-2 text-base" style={{ color: '#222' }}>
                {round.description}
              </p>
            )}

            {/* Date label — Figma 32×32 calendar icon + 7px gap + 20px Bold #222, leading 1.7 */}
            {/* 0.75×: 24×24 icon, gap-1.5 (6px), 15px */}
            {round.dateLabel && (
              <div className="flex items-center gap-1.5 mb-4">
                <CalendarToday className="shrink-0 w-6 h-6 text-[#222]" />
                <span className="text-base font-bold" style={{ color: '#222' }}>
                  {round.dateLabel}
                </span>
              </div>
            )}

            {/* Divider line — Figma 1px line after date, gap-[22px] above → 0.75× 16px ≈ built into mb-4 above */}
            {(round.dateLabel && ((round.infoCards ?? []).length > 0 || round.formatDetails || (round.formatCards ?? []).length > 0 || round.body)) && (
              <hr className="mb-4 border-0 border-t" style={{ borderColor: '#ddd' }} />
            )}

            {/* Info cards (Time/Duration) — white bg, rounded-xl, side by side */}
            {/* Gap: Figma 20→15px ≈ gap-4. Margin below: 42→32px ≈ mb-8 */}
            {(round.infoCards ?? []).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-8 items-start">
                {(round.infoCards ?? []).map((card, j) => (
                  <div
                    key={`info-${card.heading}-${j}`}
                    className="rounded-xl px-5 py-3"
                    style={{ backgroundColor: '#fff' }}
                  >
                    <div className="font-bold text-base mb-2" style={{ color }}>
                      {card.heading}
                    </div>
                    <RichText html={card.body} className="m-0 text-base text-[#222]" />
                  </div>
                ))}
              </div>
            )}

            {/* Format section — "Format :" label shown when formatDetails or formatCards exist */}
            {(round.formatDetails || (round.formatCards ?? []).length > 0) && (
              <div className="mb-5">
                <div className="font-bold text-base mb-0" style={{ color }}>Format :</div>
                {round.formatDetails && (
                  <RichText html={round.formatDetails} className="m-0 text-base text-[#222]" />
                )}
                {(round.formatCards ?? []).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mt-2 md:mt-4 items-start">
                    {(round.formatCards ?? []).map((card, j) => (
                      <div
                        key={`cat-${card.heading}-${j}`}
                        className="rounded-xl px-5 py-3"
                        style={{ backgroundColor: '#fff' }}
                      >
                        <div className="font-semibold text-base mb-2" style={{ color: '#222' }}>
                          {card.heading}
                        </div>
                        <p className="m-0 text-base" style={{ color: '#222' }}>
                          {card.body}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Body — richtext (paragraphs, bullets, bold, whatever the round needs) */}
            {round.body && (
              <RichText html={round.body} className="m-0 text-base text-[#222]" />
            )}
          </div>
        ))}

        {/* CTA buttons — same pattern as CompetitionStructure */}
        {(ctaText || secondaryCtaText) && (
          <div className="flex flex-wrap justify-center gap-7 mt-10">
            {ctaText && (
              <CompetitionCTA
                text={ctaText}
                href={ctaLink}
                bgColor={color}
                textColor="#ffffff"
              />
            )}
            {secondaryCtaText && (
              <CompetitionCTA
                text={secondaryCtaText}
                href={secondaryCtaLink}
                bgColor="transparent"
                textColor={color}
                border={`1px solid ${color}`}
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
