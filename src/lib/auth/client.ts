'use client'

import { createPayloadAuthClient } from '@delmaredigital/payload-better-auth/client'

// Pre-configured with twoFactor, apiKey, and passkey plugins
export const authClient = createPayloadAuthClient()

export const { useSession, signIn, signUp, signOut, twoFactor, passkey } = authClient
