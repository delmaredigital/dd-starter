import type { Access } from 'payload'
import type { User } from '@/payload-types'

export const isCMSAdmin = (user: Pick<User, 'role'> | null | undefined): boolean =>
  user?.role === 'admin'

export const admin: Access = ({ req: { user } }) => isCMSAdmin(user)
