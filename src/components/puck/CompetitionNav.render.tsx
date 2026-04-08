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
        className="flex justify-between items-center w-full mx-auto"
        style={{ maxWidth: '1280px' }}
      >
        {/* Left: logos */}
        <div className="flex items-center">
          {partnerLogo?.url && (
            <a href={partnerLink} target="_blank" rel="noopener noreferrer">
              <img src={partnerLogo.url} alt={partnerLogo.alt || ''} className="flex-shrink-0" style={{ width: 'auto', height: '45px', marginRight: '15px' }} />
            </a>
          )}
          <a href="/" target="_blank" rel="noopener noreferrer">
            <img src="/competition-assets/algoed-logo.png" alt="AlgoEd" className="flex-shrink-0" style={{ width: '124px' }} />
          </a>
        </div>

        {/* Desktop nav — hidden below lg (≈991px source breakpoint) */}
        <div className="hidden lg:flex items-center min-w-0" style={{ gap: '8px' }}>
          <nav className="flex items-center [gap:clamp(4px,1vw,16px)]">
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline whitespace-nowrap rounded-[12px] [padding:12px_clamp(8px,1.5vw,24px)]"
                style={{ color: '#000', fontSize: '16px', fontWeight: 500, lineHeight: '24px', letterSpacing: '-0.01em' }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center" style={{ gap: '24px' }}>
            <div style={{ backgroundColor: '#e0e3de', width: '1px', height: '24px' }} />
            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline text-white font-bold text-center"
              style={{
                backgroundColor: color,
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                lineHeight: '24px',
              }}
            >
              {ctaText}
            </a>
          </div>
        </div>

        {/* Mobile hamburger — shown below lg */}
        <div className="lg:hidden">
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
