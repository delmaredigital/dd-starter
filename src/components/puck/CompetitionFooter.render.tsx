/**
 * CompetitionFooter — render function and types.
 * Server-safe: no client-only imports.
 *
 * Privacy/terms links and copyright are identical across all competitions — hardcoded.
 * Only primaryColor varies per competition.
 * Source CSS: .competition-footer, .heading-52, .heading-53, .heading-54, .container-50
 */
import Link from 'next/link'
import { safeHex } from './shared'

export interface CompetitionFooterProps {
  primaryColor: string
}

export const defaultProps: CompetitionFooterProps = {
  primaryColor: '#004785',
}

export function CompetitionFooterRender({
  primaryColor,
}: CompetitionFooterProps) {
  const color = safeHex(primaryColor)

  return (
    <section style={{ backgroundColor: color, paddingTop: '31px', paddingBottom: '31px' }}>
      <div className="max-w-[1200px] mx-auto px-5 lg:px-0">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mx-5">
          <Link href="/legal/privacy-policy" className="no-underline">
            <h6 className="text-white font-medium m-0" style={{ fontSize: '16px', lineHeight: '18px' }}>
              PRIVACY POLICY
            </h6>
          </Link>
          <Link href="/legal/terms-conditions" className="no-underline">
            <h6 className="text-white font-medium m-0" style={{ fontSize: '16px', lineHeight: '18px' }}>
              TERMS &amp; CONDITIONS
            </h6>
          </Link>
          <h6 className="text-white font-semibold m-0" style={{ fontSize: '16px', lineHeight: '18px' }}>
            &copy;AlgoEd 2026
          </h6>
        </div>
      </div>
    </section>
  )
}
