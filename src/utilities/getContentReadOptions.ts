import type { Payload } from 'payload'
import { draftMode, headers } from 'next/headers'
import { isCMSAdmin } from '@/access/admin'

export async function getContentReadOptions(payload: Payload) {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return { draft: false, overrideAccess: false as const }

  // A draft cookie can survive logout or role changes. Recheck the current
  // session instead of treating the cookie as permission to bypass access.
  const { user } = await payload.auth({ headers: await headers() })
  return { draft: isCMSAdmin(user), user, overrideAccess: false as const }
}
