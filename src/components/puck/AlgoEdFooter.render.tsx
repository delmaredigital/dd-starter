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
          {/*
            Alpha pattern tile (127.825 × 93), derived from path 79 × 62:
            - Tile width = 79 × φ ≈ 128 (large alpha = 1/φ of tile)
            - Tile height = 62 + 31 = 93 (row gap = half alpha height)
            - Small scale = 0.382 (1 − 1/φ)
            - Small position: x=88.3 (centered in gap), y=23.7 (62 × 0.382)
            backgroundSize controls density (tile count across panel).
          */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'url(/competition-assets/alpha-pattern.svg)',
              backgroundSize: 'calc(100% / 3) auto',
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
