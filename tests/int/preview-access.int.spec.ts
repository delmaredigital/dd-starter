// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Payload } from 'payload'
import { NextRequest } from 'next/server'

/**
 * Draft-mode authorization, tested without a database:
 * - /next/preview only enables draft mode for admins
 * - frontend reads never trust the draft cookie on its own
 */
const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  enable: vi.fn(),
  disable: vi.fn(),
  redirect: vi.fn(),
  draftMode: vi.fn(),
  headers: vi.fn(),
}))
vi.mock('@payload-config', () => ({ default: Promise.resolve({}) }))
vi.mock('payload', () => ({
  getPayload: async () => ({ auth: mocks.auth, logger: { error: vi.fn() } }),
}))
vi.mock('next/headers', () => ({ draftMode: mocks.draftMode, headers: mocks.headers }))
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }))

import { GET } from '@/app/(frontend)/next/preview/route'
import { getContentReadOptions } from '@/utilities/getContentReadOptions'

const SECRET = 'test-preview-secret'

function previewRequest(secret = SECRET, path = '/some-page') {
  const query = new URLSearchParams({ path, collection: 'pages', slug: 'some-page', previewSecret: secret })
  return new NextRequest(`http://localhost:3000/next/preview?${query}`)
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.draftMode.mockResolvedValue({ isEnabled: true, enable: mocks.enable, disable: mocks.disable })
  mocks.headers.mockResolvedValue(new Headers())
  vi.stubEnv('PREVIEW_SECRET', SECRET)
})
afterEach(() => vi.unstubAllEnvs())

describe('GET /next/preview', () => {
  it.each([
    ['anonymous', null],
    ['a non-admin user', { id: 2, role: 'user' }],
  ])('rejects %s and disables draft mode', async (_label, user) => {
    mocks.auth.mockResolvedValue({ user, permissions: {} })
    const res = await GET(previewRequest())
    expect(res.status).toBe(403)
    expect(mocks.enable).not.toHaveBeenCalled()
    expect(mocks.disable).toHaveBeenCalledOnce()
    expect(mocks.redirect).not.toHaveBeenCalled()
  })

  it('enables draft mode for an admin and redirects to the path', async () => {
    mocks.auth.mockResolvedValue({ user: { id: 1, role: 'admin' }, permissions: {} })
    await GET(previewRequest())
    expect(mocks.enable).toHaveBeenCalledOnce()
    expect(mocks.redirect).toHaveBeenCalledWith('/some-page')
  })

  it('rejects a wrong preview secret before consulting the session', async () => {
    const res = await GET(previewRequest('wrong'))
    expect(res.status).toBe(403)
    expect(mocks.auth).not.toHaveBeenCalled()
    expect(mocks.enable).not.toHaveBeenCalled()
  })

  it('rejects protocol-relative redirect paths', async () => {
    const res = await GET(previewRequest(SECRET, '//evil.example'))
    expect(res.status).toBe(400)
    expect(mocks.enable).not.toHaveBeenCalled()
  })

  it('fails closed when session lookup throws', async () => {
    mocks.auth.mockRejectedValue(new Error('session store down'))
    const res = await GET(previewRequest())
    expect(res.status).toBe(403)
    expect(mocks.enable).not.toHaveBeenCalled()
  })
})

describe('getContentReadOptions', () => {
  const payload = { auth: mocks.auth } as unknown as Payload

  it('serves published content only and skips auth when draft mode is off', async () => {
    mocks.draftMode.mockResolvedValue({ isEnabled: false })
    await expect(getContentReadOptions(payload)).resolves.toEqual({ draft: false, overrideAccess: false })
    expect(mocks.auth).not.toHaveBeenCalled()
  })

  it.each([
    ['anonymous', null, false],
    ['a non-admin user', { id: 2, role: 'user' }, false],
    ['an admin', { id: 1, role: 'admin' }, true],
  ])('with a draft cookie re-checks the session: %s → draft=%s', async (_label, user, draft) => {
    mocks.auth.mockResolvedValue({ user, permissions: {} })
    const options = await getContentReadOptions(payload)
    expect(options).toEqual({ draft, user, overrideAccess: false })
    expect(mocks.auth).toHaveBeenCalledOnce()
  })
})
