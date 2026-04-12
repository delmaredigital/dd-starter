/**
 * EligibilityStrip — render function and types.
 * Server-safe: no client-only imports.
 *
 * Source CSS: .section-68, .text-block-135, .text-block-136, .image-163, .image-162
 * Center dividers: image-168 (383x5px, horizontal, display:none on desktop) and
 * image-147 (5x99px, vertical). Both are solid burgundy lines — recreated with CSS divs.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { usePrimaryColor } from './CompetitionColors'

export interface EligibilityStripProps {
  leftText: string
  rightText: string
  leftIcon: MediaReference | null
  rightIcon: MediaReference | null
  primaryColor: string
}

export const defaultProps: EligibilityStripProps = {
  leftText: 'This competition is for you if',
  rightText: "You're interested in STEM",
  leftIcon: null,
  rightIcon: null,
  primaryColor: '#a31f35',
}

export function EligibilityStripRender({
  leftText, rightText, leftIcon, rightIcon, primaryColor: propColor,
}: EligibilityStripProps) {
  const primaryColor = usePrimaryColor(propColor)
  return (
    <section style={{ paddingTop: '15px', paddingBottom: '15px', margin: 0 }}>
      <div className="max-w-6xl mx-auto px-5 lg:px-0">
        <div className="flex flex-col md:flex-row justify-center items-start md:items-center">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            {leftIcon?.url && <img src={leftIcon.url} alt="" className="block md:hidden mb-2" />}
            <div className="font-bold text-lg leading-7 md:ml-2">{leftText}</div>
          </div>
          {/* Horizontal divider — 383x5px, hidden on desktop (source image-168 is display:none) */}
          <div className="block md:hidden w-[383px] max-w-full h-[5px] my-4 rounded" style={{ backgroundColor: primaryColor }} />
          {/* Vertical divider — 5x99px (source image-147) */}
          <div className="hidden md:block mx-[21px] rounded" style={{ width: '5px', height: '99px', backgroundColor: primaryColor }} />
          <div className="flex items-center md:mt-0">
            <div className="font-semibold text-lg leading-7">{rightText}</div>
            {rightIcon?.url && <img src={rightIcon.url} alt="" className="hidden md:block ml-2" />}
          </div>
        </div>
      </div>
    </section>
  )
}
