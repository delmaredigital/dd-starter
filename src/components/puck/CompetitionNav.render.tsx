/**
 * CompetitionNav — render function and types.
 * Server-safe: no client-only imports.
 *
 * Navigation bar for competition pages. Shared elements (AlgoEd logo, dropdown with
 * Mock Case/Solutions) are hardcoded. Competition-specific elements (partner logo,
 * nav links, CTA) are configurable.
 *
 * Source CSS: .navigation-2, .navigation-container-2, .navigation-link-2,
 *            .navigation-button-2, .navigation-link-title, .navigation-divider
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { safeHex } from './shared'

export interface NavLinkItem {
  label: string
  href: string
}

export interface CompetitionNavProps {
  partnerLogo: MediaReference | null
  partnerLink: string
  dropdownItems: NavLinkItem[]
  navLinks: NavLinkItem[]
  ctaText: string
  ctaLink: string
  primaryColor: string
}

export const defaultProps: CompetitionNavProps = {
  partnerLogo: null,
  partnerLink: '#',
  dropdownItems: [
    { label: 'Mock Case', href: 'https://cdn.prod.website-files.com/63e35c9f156dab429d651fb9/66815a77d5c679086da5bdc1_PPT_1.pdf' },
    { label: 'High School Mock Solution', href: 'https://cdn.prod.website-files.com/63e35c9f156dab429d651fb9/66cb3514bac12c4c4be6aa6c_High%20School%20Sol..pdf' },
    { label: 'Middle School Mock Solution', href: 'https://cdn.prod.website-files.com/63e35c9f156dab429d651fb9/66cb34dabac12c4c4be6782a_Middle%20School%20Sol.pdf' },
  ],
  navLinks: [
    { label: 'FAQs', href: 'https://docs.algoed.co/article/11-competitions-general-faq' },
  ],
  ctaText: 'Competition Portal',
  ctaLink: '#',
  primaryColor: '#a31f35',
}

export function CompetitionNavRender({
  partnerLogo, partnerLink, dropdownItems, navLinks, ctaText, ctaLink, primaryColor,
}: CompetitionNavProps) {
  const color = safeHex(primaryColor)
  return (
    <nav
      className="w-full flex items-center"
      style={{ backgroundColor: '#fff', padding: '24px 5%' }}
    >
      <div
        className="flex justify-between items-center w-full mx-auto"
        style={{ maxWidth: '1280px' }}
      >
        {/* Left: logos */}
        <div className="flex items-center" style={{ width: '479px' }}>
          {partnerLogo?.url && (
            <a href={partnerLink} target="_blank" rel="noopener noreferrer" className="mr-4">
              <img src={partnerLogo.url} alt={partnerLogo.alt || ''} style={{ width: '130px', height: 'auto' }} />
            </a>
          )}
          <a href="/" target="_blank" rel="noopener noreferrer">
            <img src="/competition-assets/algoed-logo.png" alt="AlgoEd" style={{ width: '124px' }} />
          </a>
        </div>

        {/* Right: dropdown + links + CTA */}
        <div className="hidden md:flex items-center" style={{ gap: '16px' }}>
          {/* Dropdown: configurable per competition (defaults to Mock Case / Solutions) */}
          {dropdownItems.length > 0 && (
            <details className="relative" style={{ height: '100%' }}>
              <summary
                className="cursor-pointer list-none"
                style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '-0.01em', padding: '8px 16px' }}
              >
                Solutions ▾
              </summary>
              <div
                className="absolute top-full left-0 bg-white rounded-2xl shadow-lg z-10"
                style={{ minWidth: '260px', padding: '8px' }}
              >
                {dropdownItems.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block no-underline rounded-2xl p-4"
                    style={{ color: '#000' }}
                  >
                    <div className="font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.01em' }}>
                      {item.label}
                    </div>
                  </a>
                ))}
              </div>
            </details>
          )}

          {/* Nav links — configurable per competition */}
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline whitespace-nowrap"
              style={{ color: '#000', fontSize: '14px', fontWeight: 500, letterSpacing: '-0.01em', padding: '8px 16px' }}
            >
              {link.label}
            </a>
          ))}

          {/* Divider */}
          <div style={{ backgroundColor: '#e0e3de', width: '1px', height: '24px' }} />

          {/* CTA button */}
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline text-white font-semibold text-center"
            style={{
              backgroundColor: color,
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
            }}
          >
            {ctaText}
          </a>
        </div>
      </div>
    </nav>
  )
}
