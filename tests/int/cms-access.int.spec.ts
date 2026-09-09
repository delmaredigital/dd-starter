// @vitest-environment node
import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createLocalReq, getPayload, type Payload, type PayloadRequest } from 'payload'
import config from '@/payload.config'
import type { User } from '@/payload-types'

/**
 * The starter's role model, exercised against real Payload access control:
 * only `admin` may author content; `user` accounts (what public sign-up
 * creates) and anonymous callers may read published content and nothing more.
 *
 * Needs POSTGRES_URL. Media writes go to disk instead of Vercel Blob, and
 * revalidation is stubbed because there is no Next.js request in play.
 */
vi.mock('@payloadcms/storage-vercel-blob', () => ({
  vercelBlobStorage: () => (config: unknown) => config,
}))
vi.mock('next/cache', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/cache')>()),
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

type Actor = (User & { collection: 'users' }) | null
type Identity = 'anonymous' | 'user' | 'admin'
type Content = 'pages' | 'posts'

const prefix = `cms-access-${randomUUID().slice(0, 8)}`
const context = { disableRevalidate: true }
const identities: Identity[] = ['anonymous', 'user', 'admin']

const paragraph = (text: string) => ({
  root: {
    type: 'root',
    direction: null,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        direction: null,
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '', version: 1 }],
      },
    ],
  },
})
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4//8/AAX+Av4N70a4AAAAAElFTkSuQmCC',
  'base64',
)

let payload: Payload
const actors: Record<Identity, Actor> = { anonymous: null, user: null, admin: null }
const createdUsers: number[] = []
const created: Array<{ collection: Content | 'media'; id: number }> = []
const fixtures = {} as Record<Content, { published: number; draft: number }>

const track = <T extends { id: number }>(collection: Content | 'media', doc: T) => {
  created.push({ collection, id: doc.id })
  return doc
}

async function createContent(
  collection: Content,
  status: 'draft' | 'published',
  user: Actor = actors.admin,
  overrideAccess = true,
) {
  const name = `${prefix}-${randomUUID().slice(0, 8)}`
  const options = {
    collection,
    data: {
      title: name,
      slug: name,
      _status: status,
      content: paragraph('access test'),
      puckData: { root: { props: {} }, content: [] },
    },
    user,
    overrideAccess,
    context,
  }
  const doc =
    status === 'draft'
      ? await payload.create({ ...options, draft: true })
      : await payload.create(options)
  return track(collection, doc)
}

async function createMedia(user: Actor = actors.admin, overrideAccess = true) {
  const doc = await payload.create({
    collection: 'media',
    data: { alt: prefix },
    file: { data: png, mimetype: 'image/png', name: `${prefix}-${randomUUID().slice(0, 8)}.png`, size: png.length },
    user,
    overrideAccess,
    context,
  })
  return track('media', doc)
}

const expectAllowed = async <T,>(op: Promise<T>, allowed: boolean) =>
  allowed ? expect(op).resolves.toBeDefined() : expect(op).rejects.toMatchObject({ status: 403 })

const localReq = (identity: Identity) => createLocalReq({ user: actors[identity] ?? undefined }, payload)

beforeAll(async () => {
  payload = await getPayload({ config })
  for (const role of ['admin', 'user'] as const) {
    const doc = await payload.create({
      collection: 'users',
      data: { name: `${prefix}-${role}`, email: `${prefix}-${role}@example.com`, role },
      overrideAccess: true,
    })
    createdUsers.push(doc.id)
    // The first account in a database is promoted to admin by the sign-up
    // bootstrap; pin the role explicitly so the fixture is deterministic.
    const pinned = await payload.update({ collection: 'users', id: doc.id, data: { role }, overrideAccess: true })
    actors[role] = { ...pinned, collection: 'users' }
  }
  for (const collection of ['pages', 'posts'] as const) {
    fixtures[collection] = {
      published: (await createContent(collection, 'published')).id,
      draft: (await createContent(collection, 'draft')).id,
    }
  }
}, 90_000)

afterAll(async () => {
  if (!payload) return
  for (const doc of created.reverse()) {
    await payload.delete({ ...doc, overrideAccess: true, context }).catch(() => undefined)
  }
  for (const id of createdUsers) {
    await payload.delete({ collection: 'users', id, overrideAccess: true }).catch(() => undefined)
  }
  await payload.destroy()
}, 90_000)

describe.each(identities)('as %s', (identity) => {
  const isAdmin = identity === 'admin'
  const user = () => actors[identity]

  describe.each(['pages', 'posts'] as const)('%s', (collection) => {
    it('can read published content', async () => {
      const doc = await payload.findByID({ collection, id: fixtures[collection].published, user: user(), overrideAccess: false })
      expect(doc.id).toBe(fixtures[collection].published)
    })

    it(`${isAdmin ? 'can' : 'cannot'} read drafts`, async () => {
      const result = await payload.find({
        collection,
        draft: true,
        user: user(),
        overrideAccess: false,
        where: { id: { equals: fixtures[collection].draft } },
      })
      expect(result.docs.map((d) => d.id)).toEqual(isAdmin ? [fixtures[collection].draft] : [])
    })

    it(`${isAdmin ? 'can' : 'cannot'} read version history`, async () => {
      const op = payload.findVersions({
        collection,
        user: user(),
        overrideAccess: false,
        where: { parent: { equals: fixtures[collection].draft } },
      })
      if (isAdmin) expect((await op).docs.length).toBeGreaterThan(0)
      else await expect(op).rejects.toMatchObject({ status: 403 })
    })

    it(`${isAdmin ? 'can' : 'cannot'} create`, async () => {
      await expectAllowed(createContent(collection, 'published', user(), false), isAdmin)
    })

    it(`${isAdmin ? 'can' : 'cannot'} update`, async () => {
      const target = await createContent(collection, 'published')
      await expectAllowed(
        payload.update({ collection, id: target.id, data: { title: `${prefix}-updated` }, user: user(), overrideAccess: false, context }),
        isAdmin,
      )
    })

    it(`${isAdmin ? 'can' : 'cannot'} delete`, async () => {
      const target = await createContent(collection, 'published')
      await expectAllowed(payload.delete({ collection, id: target.id, user: user(), overrideAccess: false, context }), isAdmin)
    })
  })

  describe('media', () => {
    it('can read', async () => {
      const target = await createMedia()
      const doc = await payload.findByID({ collection: 'media', id: target.id, user: user(), overrideAccess: false })
      expect(doc.id).toBe(target.id)
    })

    it(`${isAdmin ? 'can' : 'cannot'} upload`, async () => {
      await expectAllowed(createMedia(user(), false), isAdmin)
    })

    it(`${isAdmin ? 'can' : 'cannot'} update`, async () => {
      const target = await createMedia()
      await expectAllowed(
        payload.update({ collection: 'media', id: target.id, data: { alt: `${prefix}-updated` }, user: user(), overrideAccess: false }),
        isAdmin,
      )
    })

    it(`${isAdmin ? 'can' : 'cannot'} delete`, async () => {
      const target = await createMedia()
      await expectAllowed(payload.delete({ collection: 'media', id: target.id, user: user(), overrideAccess: false }), isAdmin)
    })
  })

  describe.each(['header', 'footer'] as const)('%s global', (slug) => {
    it('can read', async () => {
      await expect(payload.findGlobal({ slug, user: user(), overrideAccess: false })).resolves.toBeDefined()
    })

    it(`${isAdmin ? 'can' : 'cannot'} update`, async () => {
      const existing = await payload.findGlobal({ slug })
      await expectAllowed(
        payload.updateGlobal({ slug, data: { navItems: existing.navItems ?? [] }, user: user(), overrideAccess: false, context }),
        isAdmin,
      )
    })
  })

  describe.each(['puck-templates', 'redirects', 'search', 'payload-folders'] as const)('%s collection', (slug) => {
    it(`${isAdmin ? 'grants' : 'denies'} write access`, async () => {
      const req = await localReq(identity)
      for (const operation of ['create', 'update', 'delete'] as const) {
        // Search records are created by the plugin's sync hook, never by a request.
        const expected = slug === 'search' && operation === 'create' ? false : isAdmin
        const check = payload.collections[slug].config.access[operation]
        expect(await check({ req }), `${slug}.${operation}`).toBe(expected)
      }
    })
  })
})

describe('page-tree endpoints', () => {
  const endpoints = () => payload.config.endpoints.filter((e) => e.path.startsWith('/page-tree/'))

  it('are registered', () => {
    expect(endpoints().length).toBeGreaterThan(0)
  })

  it.each([
    ['anonymous', 401],
    ['user', 403],
  ] as const)('reject %s with %s before running any tree operation', async (identity, status) => {
    const req = await localReq(identity)
    req.json = async () => ({})
    for (const endpoint of endpoints()) {
      const res = await endpoint.handler(req)
      expect(res?.status, endpoint.path).toBe(status)
    }
  })
})

describe('job runner access', () => {
  const run = (req: PayloadRequest) => {
    const check = payload.config.jobs.access?.run
    if (!check) throw new Error('jobs.access.run is not configured')
    return check({ req })
  }
  const withSecret = async (fn: () => Promise<void>, secret: string | undefined) => {
    const saved = process.env.CRON_SECRET
    if (secret === undefined) delete process.env.CRON_SECRET
    else process.env.CRON_SECRET = secret
    try {
      await fn()
    } finally {
      if (saved === undefined) delete process.env.CRON_SECRET
      else process.env.CRON_SECRET = saved
    }
  }

  it.each([
    ['anonymous', undefined, false],
    ['user', undefined, false],
    ['admin', undefined, true],
    ['anonymous', 'wrong', false],
    ['anonymous', 'valid', true],
  ] as const)('%s with bearer %s → %s', async (identity, token, expected) => {
    await withSecret(async () => {
      const req = await localReq(identity)
      req.headers = new Headers(token ? { authorization: `Bearer ${token === 'valid' ? process.env.CRON_SECRET : token}` } : {})
      expect(await run(req)).toBe(expected)
    }, `${prefix}-cron`)
  })

  it('denies a literal "Bearer undefined" when CRON_SECRET is unset', async () => {
    await withSecret(async () => {
      const req = await localReq('anonymous')
      req.headers = new Headers({ authorization: 'Bearer undefined' })
      expect(await run(req)).toBe(false)
    }, undefined)
  })
})
