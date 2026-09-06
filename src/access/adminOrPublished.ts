import type { Access } from 'payload'
import { isCMSAdmin } from './admin'

export const adminOrPublished: Access = ({ req: { user } }) => {
  if (isCMSAdmin(user)) return true

  return { _status: { equals: 'published' } }
}
