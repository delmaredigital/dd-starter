import type { Access } from 'payload'
import type { User } from '@/payload-types'

/**
 * The CMS role model for this starter:
 *
 * - `admin`: may use the admin panel and author content (pages, posts, media,
 *   globals, redirects, templates, folders, jobs).
 * - `user`: an authenticated account with no CMS privileges. Public sign-up
 *   creates `user` accounts, so nothing in the CMS may trust "authenticated"
 *   as a write boundary.
 */
export const isAdmin = (user: Pick<User, 'role'> | null | undefined): boolean =>
  user?.role === 'admin'

export const admin: Access = ({ req: { user } }) => isAdmin(user)
