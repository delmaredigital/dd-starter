/**
 * CompetitionStructure — render function and types.
 * Server-safe: no client-only imports.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, safeHex } from './shared'

export interface CategoryItem {
  name: string
  grades: string
}

export interface RoundItem {
  title: string
  bullets: { value: string }[]
}

export interface CompetitionStructureProps {
  heading: string
  subheading: string
  teamSize: string
  teamIcon: MediaReference | null
  categoriesIcon: MediaReference | null
  categories: CategoryItem[]
  rounds: RoundItem[]
  roundsIcon: MediaReference | null
  ctaText: string
  ctaLink: string
  primaryColor: string
}

export const defaultProps: CompetitionStructureProps = {
  heading: 'How does the competition work?',
  subheading: 'Competition Structure and Details',
  teamSize: '2-5 students per team\n(all team members must be from the same school)',
  teamIcon: null,
  categoriesIcon: null,
  categories: [
    { name: 'Middle School Category', grades: 'Grade 6 - 8 (Year 7 - 9)' },
    { name: 'High School Category', grades: 'Grade 9 - 12 (Year 10 - 13)' },
  ],
  rounds: [
    { title: 'Preliminary: Test', bullets: [
      { value: 'Middle School Category: No deep knowledge of any particular subject required.' },
      { value: 'High School Category: Requires basic biology, chemistry, physics, and math knowledge.' },
    ]},
  ],
  roundsIcon: null,
  ctaText: 'Competition Portal',
  ctaLink: '/portal',
  primaryColor: '#a31f35',
}

export function CompetitionStructureRender({
  heading, subheading, teamSize, teamIcon, categoriesIcon,
  categories, rounds, roundsIcon, ctaText, ctaLink, primaryColor,
}: CompetitionStructureProps) {
  const color = safeHex(primaryColor)

  return (
    <section style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="max-w-[940px] mx-auto px-4 md:px-0 flex flex-col items-stretch">
        <h2
          className="font-poppins text-center mb-5"
          style={{ color: '#000', fontSize: '26px', lineHeight: '35px' }}
        >
          {heading}
        </h2>

        {/* Structure and Details card with bg image overlay */}
        <div
          className="rounded-[20px] pt-[1px]"
          style={{
            backgroundPosition: '50%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundColor: '#333',
          }}
        >
          <h3
            className="font-poppins text-white text-center mt-[50px] mb-0"
            style={{ fontSize: '22px' }}
          >
            {subheading}
          </h3>

          {/* Two column: Team Size + Categories */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-5 p-0 relative"
            style={{ top: '51px' }}
          >
            {/* Team Size */}
            <div
              className="rounded-[20px] p-5"
              style={{ backgroundColor: '#f2f3f0' }}
            >
              {teamIcon?.url && <img src={teamIcon.url} alt="" className="w-10" />}
              <h3 className="font-poppins mt-[5px] mb-[15px]" style={{ fontSize: '18px', lineHeight: '24px' }}>
                Team size
              </h3>
              <p className="whitespace-pre-line m-0">{teamSize}</p>
            </div>

            {/* Categories */}
            <div
              className="rounded-[20px] p-5"
              style={{ backgroundColor: '#f2f3f0' }}
            >
              {categoriesIcon?.url && <img src={categoriesIcon.url} alt="" className="w-10" />}
              <h3 className="font-poppins mt-[5px] mb-[15px]" style={{ fontSize: '18px', lineHeight: '24px' }}>
                Categories
              </h3>
              {categories.map((cat, i) => (
                <div key={i}>
                  <div
                    className="font-poppins font-semibold mb-[6px]"
                    style={{ color: '#a90733', fontSize: '16px' }}
                  >
                    {cat.name}
                  </div>
                  <p className="mb-0">{cat.grades}</p>
                  {i < categories.length - 1 && (
                    <div className="my-[10px]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What do teams need to do? */}
        <div
          className="rounded-[20px] mt-[70px] p-5"
          style={{ backgroundColor: '#f2f3f0' }}
        >
          {roundsIcon?.url && <img src={roundsIcon.url} alt="" className="w-10" />}
          <h3 className="font-poppins mt-[5px] mb-[15px]" style={{ fontSize: '18px', lineHeight: '24px' }}>
            What do teams need to do?
          </h3>

          {rounds.map((round, i) => (
            <div key={i}>
              {i === 0 ? (
                <div className="flex items-start mb-0">
                  <div
                    className="font-poppins font-semibold"
                    style={{ color, fontSize: '18px', lineHeight: '24px' }}
                  >
                    {round.title}
                  </div>
                </div>
              ) : null}
              {round.bullets.map((bullet, j) => (
                <div key={j} className="flex items-center mt-[15px]">
                  <p className="mb-1">{bullet.value}</p>
                </div>
              ))}
              {i > 0 && (
                <div
                  className="font-poppins font-semibold mt-4"
                  style={{ color, fontSize: '18px', lineHeight: '24px' }}
                >
                  {round.title}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <CompetitionCTA text={ctaText} href={ctaLink} bgColor={color} textColor="#ffffff" />
        </div>
      </div>
    </section>
  )
}
