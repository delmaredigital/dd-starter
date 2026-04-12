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
import { CompetitionCTA, RichText, safeHex } from './shared'

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
  formatText: string
  categoryCards: DetailCard[]
  bullets: { text: string }[]
  body: string
}

export interface CompetitionFormatV2Props {
  heading: string
  rounds: FormatRound[]
  ctaText: string
  ctaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  primaryColor: string
  cardBgColor: string
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
          body: 'Asia Pacific: 12:00 noon Tokyo Time\nEurope, Middle East, Africa: 9:00 am London Time\nNorth America, South America: 11:00 am New York Time',
        },
        {
          heading: 'Duration',
          body: 'Lower Primary School Category: 45 minutes\nUpper Primary School Category: 1 hour',
        },
      ],
      formatText:
        'Online challenge (multiple choice, fill in the blanks, and free-response questions)',
      categoryCards: [
        {
          heading: 'Lower Primary School Category (Grades K\u20132):',
          body: 'Focuses on number awareness and foundational math concepts, along with simple logic questions that develop early reasoning skills.',
        },
        {
          heading: 'Upper Primary School Category (Grades 3\u20135):',
          body: 'Based on math and science concepts students are learning in school, combined with logic problems that build confidence and problem-solving skills.',
        },
      ],
      bullets: [
        { text: 'Each team member will individually attempt the same set of challenge' },
        { text: 'The top two scores will be used to calculate the team\u2019s total score' },
      ],
      body: '',
    },
    {
      title: 'Semi-final round: Poster / video',
      description:
        'The top 3 performing teams from each grade level in the preliminary round (18 teams in total) will be invited to compete in the global semi-final round',
      dateLabel: 'Deadline: 11:59pm Eastern Time (New York Time), April 3, 2027',
      infoCards: [],
      formatText: '',
      categoryCards: [
        {
          heading: 'Lower Primary School Category (Grades K\u20132):',
          body: 'Semi-finalist teams will have one week to create a poster with a solution to a science problem.',
        },
        {
          heading: 'Upper Primary School Category (Grades 3\u20135):',
          body: 'Semi-finalist teams will have one week to develop a solution to a science problem and present their work through a recorded 5-minute video.',
        },
      ],
      bullets: [],
      body: '',
    },
    {
      title: 'Final round: live Zoom presentation',
      description:
        'The top 5 performing team from the preliminary round in each of the Lower Primary and Upper Primary Categories will be invited to compete in the global final round',
      dateLabel: 'April 24, 2027 10:00am Eastern Time (New York Time)',
      infoCards: [],
      formatText: '',
      categoryCards: [],
      bullets: [],
      body: 'Finalist teams will have one week to refine and improve their solutions from the semi-final round based on judges\u2019 feedback, and present their final solution to a judging panel composed of UNC Medical Brigades students.',
    },
  ],
  ctaText: 'Register Now!',
  ctaLink: '/register',
  secondaryCtaText: 'Join the league',
  secondaryCtaLink: '/league',
  primaryColor: '#13294C',
  cardBgColor: '#EAF2FF',
}

/* ── Render ──────────────────────────────────────────────── */

export function CompetitionFormatV2Render({
  heading,
  rounds: rawRounds,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  primaryColor,
  cardBgColor,
}: CompetitionFormatV2Props) {
  const color = safeHex(primaryColor)
  const cardBg = safeHex(cardBgColor, '#EAF2FF')
  const rounds = rawRounds ?? []

  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-2.5 md:px-5 lg:px-0">
        {/* Heading — Figma 40px Bold #222 → 0.75× 30px. Gap to first card: 48→36px ≈ mb-9 */}
        <h2
          className="font-bold text-center mb-9"
          style={{ fontSize: '30px', lineHeight: '1.3', color: '#222' }}
        >
          {heading}
        </h2>

        {/* Round cards */}
        {rounds.map((round, i) => (
          <div
            key={`format-round-${round.title}-${i}`}
            className={`rounded-xl px-12 py-7 ${i > 0 ? 'mt-12' : ''}`}
            style={{ backgroundColor: cardBg }}
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
              <p className="mt-0 mb-2 text-[15px]" style={{ color: '#222' }}>
                {round.description}
              </p>
            )}

            {/* Date label — Figma 32×32 calendar icon + 7px gap + 20px Bold #222, leading 1.7 */}
            {/* 0.75×: 24×24 icon, gap-1.5 (6px), 15px */}
            {round.dateLabel && (
              <div className="flex items-center gap-1.5 mb-4">
                <img
                  src="/competition-assets/calendar-today.svg"
                  alt=""
                  className="shrink-0 w-6 h-6"
                />
                <span className="text-[15px] font-bold" style={{ color: '#222' }}>
                  {round.dateLabel}
                </span>
              </div>
            )}

            {/* Divider line — Figma 1px line after date, gap-[22px] above → 0.75× 16px ≈ built into mb-4 above */}
            {(round.dateLabel && ((round.infoCards ?? []).length > 0 || round.formatText || (round.categoryCards ?? []).length > 0 || round.body)) && (
              <hr className="mb-4 border-0 border-t" style={{ borderColor: '#ddd' }} />
            )}

            {/* Info cards (Time/Duration) — white bg, rounded-xl, side by side */}
            {/* Gap: Figma 20→15px ≈ gap-4. Margin below: 42→32px ≈ mb-8 */}
            {(round.infoCards ?? []).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {(round.infoCards ?? []).map((card, j) => (
                  <div
                    key={`info-${card.heading}-${j}`}
                    className="rounded-xl px-5 py-3"
                    style={{ backgroundColor: '#fff' }}
                  >
                    <div className="font-bold text-[15px] mb-2" style={{ color: '#222' }}>
                      {card.heading}
                    </div>
                    <p className="m-0 text-[15px] whitespace-pre-line" style={{ color: '#222' }}>
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Format section — Figma 20px Bold primaryColor label + Regular text, leading 1.6 */}
            {round.formatText && (
              <div className="mb-5">
                <p className="m-0 text-[15px]" style={{ color: '#222' }}>
                  <span className="font-bold" style={{ color }}>Format: </span>
                  {round.formatText}
                </p>
              </div>
            )}

            {/* Category detail cards — white bg, 14→10.5 ≈ rounded-xl */}
            {/* Padding: L 27→20 ≈ px-5, T 16→12 ≈ py-3. Heading: SemiBold #222 */}
            {(round.categoryCards ?? []).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                {(round.categoryCards ?? []).map((card, j) => (
                  <div
                    key={`cat-${card.heading}-${j}`}
                    className="rounded-xl px-5 py-3"
                    style={{ backgroundColor: '#fff' }}
                  >
                    <div className="font-semibold text-[15px] mb-2" style={{ color: '#222' }}>
                      {card.heading}
                    </div>
                    <p className="m-0 text-[15px]" style={{ color: '#222' }}>
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Bullets — Figma 20px Regular #222, leading 1.6 */}
            {(round.bullets ?? []).length > 0 && (
              <ul className="mb-5 pl-5 text-[15px]" style={{ color: '#222' }}>
                {(round.bullets ?? []).map((bullet, j) => (
                  <li key={`bullet-${j}`} className="mb-1">{bullet.text}</li>
                ))}
              </ul>
            )}

            {/* Additional body text — Figma 22px Regular #222, leading 1.6 → 0.75× 16px = text-base */}
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
                padding="14px 40px"
              />
            )}
            {secondaryCtaText && (
              <CompetitionCTA
                text={secondaryCtaText}
                href={secondaryCtaLink}
                bgColor="transparent"
                textColor={color}
                padding="14px 40px"
                border={`1px solid ${color}`}
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
