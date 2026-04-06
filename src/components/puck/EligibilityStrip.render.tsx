/**
 * EligibilityStrip — render function and types.
 * Server-safe: no client-only imports.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'

export interface EligibilityStripProps {
  leftText: string
  rightText: string
  leftIcon: MediaReference | null
  rightIcon: MediaReference | null
}

export const defaultProps: EligibilityStripProps = {
  leftText: 'This competition is for you if',
  rightText: "You're interested in STEM",
  leftIcon: null,
  rightIcon: null,
}

export function EligibilityStripRender({
  leftText, rightText, leftIcon, rightIcon,
}: EligibilityStripProps) {
  return (
    <section style={{ paddingTop: '15px', paddingBottom: '15px', margin: 0 }}>
      <div className="max-w-[940px] mx-auto px-4 md:px-0">
        <div className="flex flex-col md:flex-row justify-center items-start md:items-center">
          <div className="flex items-center">
            {leftIcon?.url && <img src={leftIcon.url} alt="" className="block" />}
            <div className="font-poppins font-bold text-[20px] md:text-[25px] leading-[28px] md:leading-[30px] ml-2">{leftText}</div>
          </div>
          <div className="flex items-center mt-4 md:mt-0 md:ml-6">
            <div className="font-poppins font-semibold text-[18px] md:text-[25px] leading-[25px] md:leading-[30px]">{rightText}</div>
            {rightIcon?.url && <img src={rightIcon.url} alt="" className="hidden md:block ml-2" />}
          </div>
        </div>
      </div>
    </section>
  )
}
