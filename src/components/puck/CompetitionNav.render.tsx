/**
 * CompetitionNav — render function and types.
 * Server-safe: no client-only imports.
 *
 * Navigation bar for competition pages. AlgoEd logo is hardcoded.
 * Partner logo, nav links, and CTA are configurable per competition.
 *
 * Source CSS: .navigation-2, .navigation-container-2, .navigation-link-2,
 *            .navigation-button-2, .navigation-divider
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { MobileNav } from './MobileNav'

export interface NavLinkItem {
  label: string
  href: string
}

// Universal nav button colors — consistent across all competition pages,
// independent of per-competition primaryColor.
const NAV_CTA_BG = '#3247C6'
const NAV_CTA_TINT = '#EBEDFC'

export function NavCTAButton({
  href,
  text,
  variant = 'primary',
  className = '',
}: {
  href: string
  text: string
  variant?: 'primary' | 'secondary'
  className?: string
}) {
  const isPrimary = variant === 'primary'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`no-underline text-center rounded-md py-3 px-5 text-sm font-semibold leading-normal hover:opacity-90 active:opacity-80 transition-opacity ${className}`}
      style={{
        backgroundColor: isPrimary ? NAV_CTA_BG : NAV_CTA_TINT,
        color: isPrimary ? '#fff' : NAV_CTA_BG,
      }}
    >
      {text}
    </a>
  )
}

export interface CompetitionNavProps {
  partnerLogo: MediaReference | null
  partnerLink: string
  navLinks: NavLinkItem[]
  ctaText: string
  ctaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
}

export const defaultProps: CompetitionNavProps = {
  partnerLogo: null,
  partnerLink: '#',
  navLinks: [],
  ctaText: 'Register Now!',
  ctaLink: '#',
  secondaryCtaText: 'More Competitions',
  secondaryCtaLink: 'https://app.algoed.co/explore-competitions',
}

export function CompetitionNavRender({
  partnerLogo,
  partnerLink,
  navLinks,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
}: CompetitionNavProps) {
  return (
    <nav
      className="w-full flex items-center relative"
      style={{ backgroundColor: '#fff', padding: '24px 5%' }}
    >
      <div className="flex items-center w-full mx-auto gap-4" style={{ maxWidth: '1280px' }}>
        {/* Left: logos — preferred height, shrinkable on small screens */}
        <div className="flex items-center">
          {partnerLogo?.url && (
            <a href={partnerLink} target="_blank" rel="noopener noreferrer">
              <img
                src={partnerLogo.url}
                alt={partnerLogo.alt || ''}
                className="h-[45px] max-w-[40vw] object-contain mr-4"
              />
            </a>
          )}
          <a href="https://algoed.co" target="_blank" rel="noopener noreferrer">
            <img
              src="/competition-assets/algoed-logo.png"
              alt="AlgoEd"
              className="h-[50px] max-w-[30vw] object-contain"
            />
          </a>
        </div>

        {/* Desktop nav — hidden below lg, pushed right via ml-auto */}
        <div className="hidden lg:flex items-center flex-1 gap-6">
          <nav className="flex items-center gap-6 ml-auto">
            {(navLinks ?? []).map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline whitespace-nowrap rounded-[12px] py-3 text-base font-medium leading-normal text-black tracking-tight"
              >
                {link.label}
              </a>
            ))}
          </nav>
          {(navLinks ?? []).length > 0 && <div className="w-px h-6 bg-gray-300" />}
          <div className="flex items-center gap-4">
            <NavCTAButton href={ctaLink} text={ctaText} />
            {secondaryCtaText && (
              <NavCTAButton href={secondaryCtaLink} text={secondaryCtaText} variant="secondary" />
            )}
          </div>
        </div>

        {/* Mobile hamburger — shown below lg */}
        <div className="lg:hidden ml-auto">
          <MobileNav navLinks={navLinks ?? []} ctaText={ctaText} ctaLink={ctaLink} />
        </div>
      </div>
    </nav>
  )
}
