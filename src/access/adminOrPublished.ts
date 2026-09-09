import type { Access } from 'payload'
import { isAdmin } from './admin'

/**
 * Admins see everything (including drafts); everyone else sees published docs only.
 */
export const adminOrPublished: Access = ({ req: { user } }) => {
  if (isAdmin(user)) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}
