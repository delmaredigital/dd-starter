/**
 * FeeWaiver — render function and types.
 * Server-safe: no client-only imports.
 *
 * Content is identical across all competitions — not meaningfully configurable.
 * Source CSS: .section-103, .heading-149, .text-block-218, .div-block-310
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'

export interface FeeWaiverProps {
  icon: MediaReference | null
  dividerImage: MediaReference | null
}

export const defaultProps: FeeWaiverProps = {
  icon: null,
  dividerImage: null,
}

export function FeeWaiverRender({
  icon, dividerImage,
}: FeeWaiverProps) {
  return (
    <section style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="max-w-[940px] mx-auto px-4 md:px-0 flex flex-col items-start" style={{ gap: '12px' }}>
        {dividerImage?.url && (
          <img src={dividerImage.url} alt="" className="w-full max-w-full mb-2" />
        )}
        <div className="flex items-start" style={{ gap: '10px' }}>
          {icon?.url && <img src={icon.url} alt="" />}
          <div>
            <h3
              className="font-bold mt-0 mb-0"
              style={{ fontSize: '16px', lineHeight: '20px' }}
            >
              Fee Waiver Policy
            </h3>
            <div className="mt-[7px]" style={{ fontSize: '12px' }}>
              Fee waiver is available for individual low-income students. Please ask your school counselor or principal to send an email titled &apos;Fee Waiver Request&apos; to{' '}
              <a href="mailto:waivers@algoed.co?subject=Fee%20Waiver%20Request">waivers@algoed.co</a>
              {' '}from their official school email with your email address and confirm you need a waiver.
              <br /><br />
              <strong>All fee waivers must be requested before the regular deadline.</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
