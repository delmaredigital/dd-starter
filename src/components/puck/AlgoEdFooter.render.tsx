/**
 * AlgoEdFooter — render function and types.
 * Server-safe: no client-only imports.
 *
 * Figma source: node 6373:6946
 * Left: dark bg with tiled alpha pattern + "About algoed" logo.
 * Right: description + outline CTA button.
 * All assets in public/competition-assets/ (shared across competitions).
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { CompetitionCTA, safeHex } from './shared'

export interface AlgoEdFooterProps {
  primaryColor: string
  logo: MediaReference | null
  backgroundImage: MediaReference | null
}

export const defaultProps: AlgoEdFooterProps = {
  primaryColor: '#13294C',
  logo: null,
  backgroundImage: null,
}

export function AlgoEdFooterRender({
  primaryColor,
}: AlgoEdFooterProps) {
  const color = safeHex(primaryColor)

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_5fr]">
        {/* Left: About + Logo with tiled alpha pattern */}
        <div
          className="relative flex flex-col justify-center items-center pt-9 pb-14 px-6 overflow-hidden"
          style={{ backgroundColor: color }}
        >
          {/* Alpha pattern — large + small layers, same SVG at different sizes, offset rows */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'url(/competition-assets/alpha-pattern.svg), url(/competition-assets/alpha-pattern.svg)',
              backgroundSize: '20% auto, 8% auto',
              backgroundPosition: '0 0, 10% 50%',
            }}
          />
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-white font-bold text-[34px] leading-14" style={{ fontFamily: 'serif' }}>
              About
            </div>
            <img
              src="/competition-assets/algoed-logo-text.svg"
              alt="algoed"
              className="w-44"
            />
          </div>
        </div>

        {/* Right: Description + CTA */}
        <div className="flex items-center p-8 md:py-9 md:pl-28 md:pr-16">
          <div>
            <p
              className="font-semibold text-xl leading-8 mb-2.5"
              style={{ color }}
            >
              AlgoEd is a platform that hosts curated competitions for ambitious K-12 students.
            </p>
            <CompetitionCTA
              text="Explore Competitions"
              href="https://app.algoed.co/explore-competitions"
              bgColor="#ffffff"
              textColor={color}
              padding="12px 28px"
              target="_blank"
              border={`1px solid ${color}`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
