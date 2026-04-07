/**
 * CompetitionStructure — render function and types.
 * Server-safe: no client-only imports.
 *
 * "How does the competition work?" section with team size, categories,
 * and round details. Each round is a separate visual card with per-bullet icons.
 *
 * Reference: docs/reference/webflow/mit-ewb.html section.section-73
 * Source CSS: .section-73, .heading-115/.116/.117, .div-block-209 through .div-block-216,
 *            .image-150/.151/.152, .text-block-141/.142, .paragraph-58/.59
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, safeHex } from './shared'

export interface CategoryItem {
  name: string
  grades: string
}

export interface BulletItem {
  value: string
  isLink: boolean
  href: string
}

export interface RoundItem {
  title: string
  titleIcon: MediaReference | null
  bulletIcon: MediaReference | null
  bullets: BulletItem[]
}

export interface CompetitionStructureProps {
  heading: string
  subheading: string
  structureBgImage: MediaReference | null
  teamSize: string
  teamIcon: MediaReference | null
  categoriesIcon: MediaReference | null
  categories: CategoryItem[]
  categoryDivider: MediaReference | null
  rounds: RoundItem[]
  roundsIcon: MediaReference | null
  ctaText: string
  ctaLink: string
  primaryColor: string
}

export const defaultProps: CompetitionStructureProps = {
  heading: 'How does the competition work?',
  subheading: 'Competition Structure and Details',
  structureBgImage: null,
  teamSize: '2-5 students per team\n(all team members must be from the same school)',
  teamIcon: null,
  categoriesIcon: null,
  categories: [
    { name: 'Middle School Category', grades: 'Grade 6 - 8 (Year 7 - 9)' },
    { name: 'High School Category', grades: 'Grade 9 - 12 (Year 10 - 13)' },
  ],
  categoryDivider: null,
  rounds: [
    {
      title: 'Preliminary: Test',
      titleIcon: null,
      bulletIcon: null,
      bullets: [
        { value: 'Middle School Category: No deep knowledge required.', isLink: false, href: '' },
        { value: 'High School Category: Requires basic STEM knowledge.', isLink: false, href: '' },
        { value: 'Access practice tests here', isLink: true, href: '#' },
      ],
    },
    {
      title: 'Final: Live Zoom Presentation',
      titleIcon: null,
      bulletIcon: null,
      bullets: [
        { value: 'Finalist teams present solutions to a judging panel of professors and industry experts.', isLink: false, href: '' },
      ],
    },
  ],
  roundsIcon: null,
  ctaText: 'Competition Portal',
  ctaLink: '/portal',
  primaryColor: '#a31f35',
}

export function CompetitionStructureRender({
  heading, subheading, structureBgImage, teamSize, teamIcon, categoriesIcon,
  categories, categoryDivider, rounds, roundsIcon, ctaText, ctaLink, primaryColor,
}: CompetitionStructureProps) {
  const color = safeHex(primaryColor)

  return (
    <section style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="max-w-[940px] mx-auto px-4 md:px-0 flex flex-col items-stretch">
        <h2
          className="text-center mb-5"
          style={{ color: '#000', fontSize: '26px', lineHeight: '35px' }}
        >
          {heading}
        </h2>

        {/* Structure and Details card */}
        <div
          className="rounded-[20px] pt-[1px]"
          style={{
            backgroundImage: structureBgImage?.url ? `url(${structureBgImage.url})` : undefined,
            backgroundPosition: '50%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundColor: '#333',
          }}
        >
          <h3
            className="text-white text-center mt-[50px] mb-0"
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
            <div className="rounded-[20px] p-5" style={{ backgroundColor: '#f2f3f0' }}>
              {teamIcon?.url && <img src={teamIcon.url} alt="" className="w-10" />}
              <h3 className="mt-[5px] mb-[15px]" style={{ fontSize: '18px', lineHeight: '24px' }}>
                Team size
              </h3>
              <p className="whitespace-pre-line m-0">{teamSize}</p>
            </div>

            {/* Categories */}
            <div className="rounded-[20px] p-5" style={{ backgroundColor: '#f2f3f0' }}>
              {categoriesIcon?.url && <img src={categoriesIcon.url} alt="" className="w-10" />}
              <h3 className="mt-[5px] mb-[15px]" style={{ fontSize: '18px', lineHeight: '24px' }}>
                Categories
              </h3>
              {categories.map((cat, i) => (
                <div key={i}>
                  <div
                    className="font-semibold mb-[6px]"
                    style={{ color: '#a90733', fontSize: '16px' }}
                  >
                    {cat.name}
                  </div>
                  <p className="mb-0">{cat.grades}</p>
                  {i < categories.length - 1 && categoryDivider?.url && (
                    <img src={categoryDivider.url} alt="" className="my-[10px]" />
                  )}
                  {i < categories.length - 1 && !categoryDivider?.url && (
                    <div className="my-[10px]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What do teams need to do? — first round shares the card */}
        <div
          className="rounded-[20px] mt-[70px] p-5"
          style={{ backgroundColor: '#f2f3f0' }}
        >
          {roundsIcon?.url && <img src={roundsIcon.url} alt="" className="w-10" />}
          <h3 className="mt-[5px] mb-[15px]" style={{ fontSize: '18px', lineHeight: '24px' }}>
            What do teams need to do?
          </h3>

          {rounds.length > 0 && (
            <div>
              {/* First round title */}
              <div className="flex items-start">
                {rounds[0].titleIcon?.url && (
                  <img src={rounds[0].titleIcon.url} alt="" className="mr-[10px]" />
                )}
                <div
                  className="font-semibold"
                  style={{ color, fontSize: '18px', lineHeight: '24px' }}
                >
                  {rounds[0].title}
                </div>
              </div>
              {/* First round bullets */}
              {rounds[0].bullets.map((bullet, j) => (
                <div key={j} className="flex items-center mt-[15px]">
                  {rounds[0].bulletIcon?.url && (
                    <img src={rounds[0].bulletIcon.url} alt="" className="mr-[10px]" />
                  )}
                  {bullet.isLink ? (
                    <a href={bullet.href} target="_blank" rel="noopener noreferrer">{bullet.value}</a>
                  ) : (
                    <p className="mb-1">{bullet.value}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subsequent rounds — each in its own card */}
        {rounds.slice(1).map((round, i) => (
          <div
            key={i}
            className="rounded-[20px] p-5"
            style={{
              backgroundColor: '#f2f3f0',
              backgroundImage: 'url(/competition-assets/final-round-bg.svg)',
              backgroundPosition: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              paddingRight: '102px',
              marginTop: '20px',
              marginBottom: '35px',
            }}
          >
            <div className="flex items-start">
              {round.titleIcon?.url && (
                <img src={round.titleIcon.url} alt="" className="mr-[10px]" />
              )}
              <div
                className="font-semibold"
                style={{ color, fontSize: '18px', lineHeight: '24px' }}
              >
                {round.title}
              </div>
            </div>
            {round.bullets.map((bullet, j) => (
              <div key={j} className="flex items-center mt-[15px]">
                {round.bulletIcon?.url && (
                  <img src={round.bulletIcon.url} alt="" className="mr-[10px]" />
                )}
                {bullet.isLink ? (
                  <a href={bullet.href} target="_blank" rel="noopener noreferrer">{bullet.value}</a>
                ) : (
                  <p className="mb-1">{bullet.value}</p>
                )}
              </div>
            ))}
          </div>
        ))}

        <div className="mt-10 flex justify-center">
          <CompetitionCTA text={ctaText} href={ctaLink} bgColor={color} textColor="#ffffff" />
        </div>
      </div>
    </section>
  )
}
