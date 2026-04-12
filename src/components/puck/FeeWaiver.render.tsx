/**
 * FeeWaiver — render function and types.
 * Server-safe: no client-only imports.
 *
 * Content is identical across all competitions — not meaningfully configurable.
 * Source CSS: .section-103, .heading-149, .text-block-218, .div-block-310
 */
import { CheckCircle } from './icons'

export interface FeeWaiverProps {}

export const defaultProps: FeeWaiverProps = {}

export function FeeWaiverRender({}: FeeWaiverProps) {
  return (
    <section style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="max-w-5xl mx-auto px-5 lg:px-0 flex flex-col items-start" style={{ gap: '12px' }}>
        <hr className="w-full border-t border-gray-300 m-0 mb-5" />
        <div className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-[#222] mt-px" />
          <div>
            <h3 className="font-bold text-xs m-0">Fee Waiver Policy</h3>
            <p className="text-xs mt-2.5 mb-0 text-justify text-[#222]">
              A fee waiver is available for individual low-income students. To request one, please ask your school counselor or principal to email support@algoed.co from their official school email with the subject line &quot;Fee Waiver Request.&quot; The email should include your email address and confirmation that you require a waiver.
            </p>
            <p className="text-xs font-semibold mt-2.5 mb-0 text-[#222]">
              All fee waivers must be requested before the regular deadline.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
