'use client'

import { createAuthClient, payloadAuthPlugins } from '@delmaredigital/payload-better-auth/client'
import { passkeyClient } from '@better-auth/passkey/client'

export const authClient = createAuthClient({
  plugins: [...payloadAuthPlugins, passkeyClient()],
})

export const { useSession, signIn, signUp, signOut, twoFactor, passkey } = authClient
