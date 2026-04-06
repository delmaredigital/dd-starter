/**
 * CompetitionFooter — render function and types.
 * Server-safe: no client-only imports.
 */
import Link from 'next/link'
import { safeHex } from './shared'

export interface CompetitionFooterProps {
  primaryColor: string
  privacyLink: string
  termsLink: string
  copyrightText: string
}

export const defaultProps: CompetitionFooterProps = {
  primaryColor: '#004785',
  privacyLink: '/legal/privacy-policy',
  termsLink: '/legal/terms-conditions',
  copyrightText: '\u00A9AlgoEd 2026',
}

export function CompetitionFooterRender({
  primaryColor, privacyLink, termsLink, copyrightText,
}: CompetitionFooterProps) {
  const color = safeHex(primaryColor)

  return (
    <section style={{ backgroundColor: color, paddingTop: '31px', paddingBottom: '31px' }}>
      <div className="max-w-[940px] mx-auto px-4 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mx-5 md:mx-0" style={{ gap: '20px' }}>
          <Link href={privacyLink} className="no-underline">
            <h6
              className="font-poppins text-white font-medium m-0"
              style={{ fontSize: '16px' }}
            >
              PRIVACY POLICY
            </h6>
          </Link>
          <Link href={termsLink} className="no-underline">
            <h6
              className="font-poppins text-white font-medium m-0"
              style={{ fontSize: '16px' }}
            >
              TERMS &amp; CONDITIONS
            </h6>
          </Link>
          <h6
            className="font-poppins text-white font-semibold m-0"
            style={{ fontSize: '16px' }}
          >
            {copyrightText}
          </h6>
        </div>
      </div>
    </section>
  )
}
