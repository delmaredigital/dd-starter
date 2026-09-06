// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Payload } from 'payload'
import { NextRequest } from 'next/server'

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

function request(secret = 'test-preview-secret', path = '/preview-page') {
  const query = new URLSearchParams({
    path,
    collection: 'pages',
    slug: 'preview-page',
    previewSecret: secret,
  })
  return new NextRequest(`http://localhost:3000/next/preview?${query}`)
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.draftMode.mockResolvedValue({
    isEnabled: true,
    enable: mocks.enable,
    disable: mocks.disable,
  })
  mocks.headers.mockResolvedValue(new Headers())
  vi.stubEnv('PREVIEW_SECRET', 'test-preview-secret')
})
afterEach(() => vi.unstubAllEnvs())

describe('draft preview authorization', () => {
  it.each([null, { id: 2, role: 'user' }])('rejects non-admin auth result %j', async (user) => {
    mocks.auth.mockResolvedValue({ user })
    const response = await GET(request())
    expect(response?.status).toBe(403)
    expect(mocks.enable).not.toHaveBeenCalled()
    expect(mocks.disable).toHaveBeenCalled()
  })
  it('allows an admin with the correct preview secret', async () => {
    mocks.auth.mockResolvedValue({ user: { id: 1, role: 'admin' } })
    await GET(request())
    expect(mocks.enable).toHaveBeenCalledOnce()
    expect(mocks.redirect).toHaveBeenCalledWith('/preview-page')
  })
  it('still rejects an incorrect preview secret', async () => {
    const response = await GET(request('wrong'))
    expect(response.status).toBe(403)
    expect(mocks.enable).not.toHaveBeenCalled()
  })
  it('still rejects external redirect paths', async () => {
    const response = await GET(request('test-preview-secret', '//example.com'))
    expect(response.status).toBe(400)
    expect(mocks.enable).not.toHaveBeenCalled()
  })
  it('fails closed when session validation fails', async () => {
    mocks.auth.mockRejectedValue(new Error('session lookup failed'))
    const response = await GET(request())
    expect(response.status).toBe(403)
    expect(mocks.enable).not.toHaveBeenCalled()
  })
})

describe('frontend draft-cookie authorization', () => {
  it('does not authenticate normal public reads', async () => {
    mocks.draftMode.mockResolvedValue({ isEnabled: false })
    const options = await getContentReadOptions({ auth: mocks.auth } as unknown as Payload)
    expect(options).toEqual({ draft: false, overrideAccess: false })
    expect(mocks.auth).not.toHaveBeenCalled()
  })
  it.each([null, { id: 2, role: 'user' }, { id: 3, role: 'admin' }])(
    'rechecks the session for an existing draft cookie: %j',
    async (user) => {
      mocks.auth.mockResolvedValue({ user })
      const options = await getContentReadOptions({ auth: mocks.auth } as unknown as Payload)
      expect(options).toEqual({ draft: user?.role === 'admin', user, overrideAccess: false })
      expect(mocks.auth).toHaveBeenCalledOnce()
    },
  )
})
