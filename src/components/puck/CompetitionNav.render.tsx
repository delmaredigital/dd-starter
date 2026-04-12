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
import { safeHex } from './shared'
import { MobileNav } from './MobileNav'

export interface NavLinkItem {
  label: string
  href: string
}

// Universal nav button colors — consistent across all competition pages,
// independent of per-competition primaryColor.
const NAV_CTA_BG = '#3247C6'
const NAV_CTA_TINT = '#EBEDFC'

export interface CompetitionNavProps {
  partnerLogo: MediaReference | null
  partnerLink: string
  navLinks: NavLinkItem[]
  ctaText: string
  ctaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  primaryColor: string
}

export const defaultProps: CompetitionNavProps = {
  partnerLogo: null,
  partnerLink: '#',
  navLinks: [
    { label: 'FAQs', href: 'https://docs.algoed.co/article/11-competitions-general-faq' },
  ],
  ctaText: 'Register Now!',
  ctaLink: '#',
  secondaryCtaText: 'More Competitions',
  secondaryCtaLink: 'https://app.algoed.co/explore-competitions',
  primaryColor: '#a31f35',
}

export function CompetitionNavRender({
  partnerLogo, partnerLink, navLinks, ctaText, ctaLink,
  secondaryCtaText, secondaryCtaLink, primaryColor,
}: CompetitionNavProps) {
  const color = safeHex(primaryColor)
  return (
    <nav
      className="w-full flex items-center relative"
      style={{ backgroundColor: '#fff', padding: '24px 5%' }}
    >
      <div
        className="flex items-center w-full mx-auto gap-4"
        style={{ maxWidth: '1280px' }}
      >
        {/* Left: logos — preferred height, shrinkable on small screens */}
        <div className="flex items-center">
          {partnerLogo?.url && (
            <a href={partnerLink} target="_blank" rel="noopener noreferrer">
              <img src={partnerLogo.url} alt={partnerLogo.alt || ''} className="h-[45px] max-w-[40vw] object-contain mr-4" />
            </a>
          )}
          <a href="/" target="_blank" rel="noopener noreferrer">
            <img src="/competition-assets/algoed-logo.png" alt="AlgoEd" className="h-[50px] max-w-[30vw] object-contain" />
          </a>
        </div>

        {/* Desktop nav — hidden below lg, pushed right via ml-auto */}
        <div className="hidden lg:flex items-center flex-1 gap-6">
          <nav className="flex items-center justify-between flex-1 min-w-0 max-w-[32rem] ml-auto">
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline whitespace-nowrap rounded-[12px] py-3"
                style={{ color: '#000', fontSize: '16px', fontWeight: 500, lineHeight: '24px', letterSpacing: '-0.01em' }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="w-px h-6 bg-gray-300" />
          {secondaryCtaText && (
            <a
              href={secondaryCtaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline font-semibold text-center rounded-md py-3 px-5 text-sm leading-normal"
              style={{ backgroundColor: NAV_CTA_TINT, color: NAV_CTA_BG }}
            >
              {secondaryCtaText}
            </a>
          )}
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline text-white font-semibold text-center rounded-md py-3 px-5 text-sm leading-normal"
            style={{ backgroundColor: NAV_CTA_BG }}
          >
            {ctaText}
          </a>
        </div>

        {/* Mobile hamburger — shown below lg */}
        <div className="lg:hidden ml-auto">
          <MobileNav
            navLinks={navLinks}
            ctaText={ctaText}
            ctaLink={ctaLink}
            primaryColor={color}
          />
        </div>
      </div>
    </nav>
  )
}
