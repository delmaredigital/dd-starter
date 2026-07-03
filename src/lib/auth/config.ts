import type { BetterAuthOptions } from 'better-auth'
import { twoFactor } from 'better-auth/plugins'
import { passkey } from '@better-auth/passkey'
import { apiKey } from '@better-auth/api-key'

export const betterAuthOptions: Partial<BetterAuthOptions> = {
  // Model names are SINGULAR - they get pluralized automatically
  // 'user' becomes 'users', 'session' becomes 'sessions', etc.
  user: {
    additionalFields: {
      // input: false keeps `role` server-only (payload-better-auth 0.8+): clients
      // cannot set it at sign-up. Role is assigned server-side by firstUserAdmin.
      role: { type: 'string', defaultValue: 'user', input: false },
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
