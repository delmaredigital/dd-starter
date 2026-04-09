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

export interface CompetitionNavProps {
  partnerLogo: MediaReference | null
  partnerLink: string
  navLinks: NavLinkItem[]
  ctaText: string
  ctaLink: string
  primaryColor: string
}

export const defaultProps: CompetitionNavProps = {
  partnerLogo: null,
  partnerLink: '#',
  navLinks: [
    { label: 'FAQs', href: 'https://docs.algoed.co/article/11-competitions-general-faq' },
  ],
  ctaText: 'Competition Portal',
  ctaLink: '#',
  primaryColor: '#a31f35',
}

export function CompetitionNavRender({
  partnerLogo, partnerLink, navLinks, ctaText, ctaLink, primaryColor,
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
        <div className="hidden lg:flex items-center ml-auto flex-1 justify-end gap-6">
          <nav className="flex items-center justify-between flex-1 max-w-[32rem]">
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
          <div style={{ backgroundColor: '#e0e3de', width: '1px', height: '24px' }} />
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline text-white font-bold text-center rounded-lg py-3 px-6"
            style={{ backgroundColor: color, fontSize: '16px', lineHeight: '24px' }}
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
