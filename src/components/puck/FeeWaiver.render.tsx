/**
 * FeeWaiver — render function and types.
 * Server-safe: no client-only imports.
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'

export interface FeeWaiverProps {
  heading: string
  body: string
  icon: MediaReference | null
  dividerImage: MediaReference | null
}

export const defaultProps: FeeWaiverProps = {
  heading: 'Fee Waiver Policy',
  body: "Fee waiver is available for individual low-income students. Please ask your school counselor or principal to send an email titled 'Fee Waiver Request' to waivers@algoed.co from their official school email with your email address and confirm you need a waiver.\n\nAll fee waivers must be requested before the regular deadline.",
  icon: null,
  dividerImage: null,
}

export function FeeWaiverRender({
  heading, body, icon, dividerImage,
}: FeeWaiverProps) {
  return (
    <section style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="max-w-[940px] mx-auto px-4 md:px-0 flex flex-col items-start" style={{ gap: '12px' }}>
        {dividerImage?.url && (
          <img
            src={dividerImage.url}
            alt=""
            className="w-full max-w-full mb-2"
          />
        )}
        <div className="flex items-start" style={{ gap: '10px' }}>
          {icon?.url && <img src={icon.url} alt="" />}
          <div>
            <h3
              className="font-poppins mt-0 mb-0"
              style={{ fontSize: '16px', lineHeight: '20px' }}
            >
              {heading}
            </h3>
            <div
              className="mt-[7px] whitespace-pre-line"
              style={{ fontSize: '12px' }}
            >
              {body}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
