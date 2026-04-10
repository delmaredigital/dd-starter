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
            Alpha pattern — 3 horizontal rows, middle row interleaved.
            SVG tile (127.825 × 93) derived from path 79 × 62:
            - Tile width = 79 × φ (large alpha = 1/φ of tile)
            - Tile height = 62 + 31 (row gap = half alpha height)
            - Small alpha: scale 0.382 (1−1/φ), x=88.3, y=23.7 (62×0.382)
            - Vertically centered via translate(0 15.5) in SVG
            Middle row offset = 63.9px = 88.3 + 79×0.382/2 − 79/2
            (aligns large alpha center in row 2 under small alpha center in row 1)
          */}
          <div className="absolute inset-0 pointer-events-none flex flex-col">
            {[0, 1, 2].map(row => (
              <div
                key={row}
                className="flex-1"
                style={{
                  backgroundImage: 'url(/competition-assets/alpha-pattern.svg)',
                  backgroundSize: 'auto 100%',
                  backgroundRepeat: 'repeat-x',
                  backgroundPositionX: row === 1 ? 63.9 : 0,
                }}
              />
            ))}
          </div>
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
