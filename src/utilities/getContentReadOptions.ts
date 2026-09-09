import type { Payload } from 'payload'
import { draftMode, headers } from 'next/headers'

import { isAdmin } from '@/access/admin'

/**
 * Read options for frontend content queries.
 *
 * Draft mode is a cookie. `/next/preview` sets it only for admins, but the
 * cookie outlives logout and role changes, so it is never treated as
 * permission by itself: when it is present we re-check the current session and
 * serve drafts only to admins. Access control is always enforced, so anyone
 * else sees exactly what the public sees.
 */
export async function getContentReadOptions(payload: Payload) {
  const { isEnabled } = await draftMode()
  if (!isEnabled) {
    return { draft: false, overrideAccess: false as const }
  }

  const { user } = await payload.auth({ headers: await headers() })
  return { draft: isAdmin(user), user, overrideAccess: false as const }
}
