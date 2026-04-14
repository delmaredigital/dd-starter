'use client'

/**
 * MobileNav — client component for hamburger menu on tablet/mobile.
 * Uses Base UI Collapsible for accessible toggle panel with height
 * animation. Matches source Webflow w-nav behavior: click hamburger,
 * panel drops down below nav bar with links on white background.
 * Shown below lg breakpoint (≈991px source breakpoint).
 */
import { Collapsible } from '@base-ui/react/collapsible'
import type { NavLinkItem } from './CompetitionNav.render'

interface MobileNavProps {
  navLinks: NavLinkItem[]
  ctaText: string
  ctaLink: string
}

export function MobileNav({
  navLinks,
  ctaText,
  ctaLink,
}: MobileNavProps) {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger
        className="flex items-center justify-center rounded-lg p-3 transition-colors data-[panel-open]:text-white"
        style={(state) => ({
          backgroundColor: state.open ? '#3e5ce7' : '#fff',
          border: `1px solid ${state.open ? '#fff' : '#f3f5fb'}`,
        })}
        aria-label="Toggle navigation menu"
      >
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0H18V2H0V0ZM0 5H18V7H0V5ZM0 10H18V12H0V10Z" fill="currentColor" />
        </svg>
      </Collapsible.Trigger>
      <Collapsible.Panel
        className="absolute left-0 right-0 top-full z-40 flex flex-col items-center overflow-hidden bg-white transition-all duration-300 ease-out h-[var(--collapsible-panel-height)] data-[ending-style]:h-0 data-[starting-style]:h-0"
      >
        <nav className="flex flex-col items-center w-full py-6 gap-1">
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block no-underline text-center w-full py-3 text-base font-medium"
            >
              {link.label}
            </a>
          ))}
          {ctaText && (
            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block no-underline text-white text-center text-base font-bold mt-2 mx-6 rounded-lg py-3 px-6"
              style={{ backgroundColor: 'var(--primary-dark, #222)', lineHeight: '24px' }}
            >
              {ctaText}
            </a>
          )}
        </nav>
      </Collapsible.Panel>
    </Collapsible.Root>
  )
}
