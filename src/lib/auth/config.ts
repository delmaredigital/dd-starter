import type { BetterAuthOptions } from 'better-auth'
import { twoFactor } from 'better-auth/plugins'
import { passkey } from '@better-auth/passkey'
import { apiKey } from '@better-auth/api-key'

export const betterAuthOptions: Partial<BetterAuthOptions> = {
  // Model names are SINGULAR - they get pluralized automatically
  // 'user' becomes 'users', 'session' becomes 'sessions', etc.
  user: {
    additionalFields: {
      role: { type: 'string', defaultValue: 'user' },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
  emailAndPassword: { enabled: true },
  plugins: [
    twoFactor(),
    apiKey({ enableMetadata: true }),
    passkey(),
  ],
}
