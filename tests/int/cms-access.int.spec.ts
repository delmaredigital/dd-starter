// @vitest-environment node
import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createLocalReq, getPayload, type Payload, type PayloadRequest } from 'payload'
import config from '@/payload.config'
import type { User } from '@/payload-types'

// Exercise real Payload permissions and local uploads without a live Blob account.
vi.mock('@payloadcms/storage-vercel-blob', () => ({
  vercelBlobStorage: () => (config: unknown) => config,
}))
vi.mock('next/cache', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/cache')>()),
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

type Actor = (User & { collection: 'users' }) | null
type ContentCollection = 'pages' | 'posts'
const prefix = `cms-access-${randomUUID()}`
const context = { disableRevalidate: true }
const richText = {
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
        children: [
          {
            type: 'text',
            text: 'Access test content.',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
        ],
      },
    ],
  },
}
let payload: Payload
const actors: Record<string, Actor> = { anonymous: null }
const users: number[] = []
const cleanup: Array<{ collection: ContentCollection | 'media'; id: number }> = []
const fixtures: Record<string, { published: number; draft: number }> = {}

function remember<T extends { id: number }>(collection: ContentCollection | 'media', doc: T): T {
  cleanup.push({ collection, id: doc.id })
  return doc
}

async function createContent(
  collection: ContentCollection,
  status: 'draft' | 'published',
  user: Actor = actors.admin,
  overrideAccess = true,
) {
  const name = `${prefix}-${randomUUID()}`
  const data = {
    title: name,
    slug: name,
    _status: status,
    content: richText,
    puckData: { root: { props: {} }, content: [] },
  }
  const doc = await payload.create({
    collection,
    data,
    draft: status === 'draft',
    user,
    overrideAccess,
    context,
  })
  return remember(collection, doc)
}

const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4//8/AAX+Av4N70a4AAAAAElFTkSuQmCC',
  'base64',
)
async function createMedia(user: Actor = actors.admin, overrideAccess = true) {
  const doc = await payload.create({
    collection: 'media',
    data: { alt: prefix },
    file: {
      data: png,
      mimetype: 'image/png',
      name: `${prefix}-${randomUUID()}.png`,
      size: png.length,
    },
    user,
    overrideAccess,
    context,
  })
  return remember('media', doc)
}

async function expectMutation<T>(operation: Promise<T>, allowed: boolean) {
  if (allowed) return expect(operation).resolves.toBeDefined()
  return expect(operation).rejects.toMatchObject({ status: 403 })
}

async function canRunJobs(req: PayloadRequest) {
  const run = payload.config.jobs.access?.run
  if (!run) throw new Error('Expected configured jobs access check')
  return run({ req })
}

beforeAll(async () => {
  payload = await getPayload({ config })
  for (const role of ['admin', 'user'] as const) {
    const doc = await payload.create({
      collection: 'users',
      data: { name: `${prefix}-${role}`, email: `${prefix}-${role}@example.com`, role },
      overrideAccess: true,
    })
    users.push(doc.id)
    // Trusted fixture setup; the public first-user flow is checked separately.
    const updated = await payload.update({
      collection: 'users',
      id: doc.id,
      data: { role },
      overrideAccess: true,
    })
    actors[role] = { ...updated, collection: 'users' }
  }
  for (const collection of ['pages', 'posts'] as const) {
    fixtures[collection] = {
      published: (await createContent(collection, 'published')).id,
      draft: (await createContent(collection, 'draft')).id,
    }
  }
}, 60000)

afterAll(async () => {
  if (!payload) return
  for (const doc of cleanup.reverse()) {
    await payload.delete({ ...doc, overrideAccess: true, context }).catch(() => undefined)
  }
  for (const id of users.reverse()) {
    await payload.delete({ collection: 'users', id, overrideAccess: true }).catch(() => undefined)
  }
  await payload.destroy()
}, 60000)

for (const identity of ['anonymous', 'user', 'admin']) {
  const allowed = identity === 'admin'
  for (const collection of ['pages', 'posts'] as const) {
    describe(`${collection}: ${identity}`, () => {
      it('reads published content', async () => {
        const doc = await payload.findByID({
          collection,
          id: fixtures[collection].published,
          user: actors[identity],
          overrideAccess: false,
        })
        expect(doc.id).toBe(fixtures[collection].published)
      })
      it('restricts draft reads to admins', async () => {
        const result = await payload.find({
          collection,
          draft: true,
          user: actors[identity],
          overrideAccess: false,
          where: { id: { equals: fixtures[collection].draft } },
        })
        expect(result.docs.map((doc) => doc.id)).toEqual(
          allowed ? [fixtures[collection].draft] : [],
        )
      })
      it('restricts version history to admins', async () => {
        const operation = payload.findVersions({
          collection,
          user: actors[identity],
          overrideAccess: false,
          where: { parent: { equals: fixtures[collection].draft } },
        })
        if (allowed) expect((await operation).docs.length).toBeGreaterThan(0)
        else await expect(operation).rejects.toMatchObject({ status: 403 })
      })
      it('restricts creation to admins', async () => {
        await expectMutation(
          createContent(collection, 'published', actors[identity], false),
          allowed,
        )
      })
      it('restricts updates to admins', async () => {
        const target = await createContent(collection, 'published')
        await expectMutation(
          payload.update({
            collection,
            id: target.id,
            data: { title: `${prefix}-updated` },
            user: actors[identity],
            overrideAccess: false,
            context,
          }),
          allowed,
        )
      })
      it('restricts deletion to admins', async () => {
        const target = await createContent(collection, 'published')
        await expectMutation(
          payload.delete({
            collection,
            id: target.id,
            user: actors[identity],
            overrideAccess: false,
            context,
          }),
          allowed,
        )
      })
    })
  }

  describe(`media: ${identity}`, () => {
    it('keeps media readable', async () => {
      const target = await createMedia()
      const doc = await payload.findByID({
        collection: 'media',
        id: target.id,
        user: actors[identity],
        overrideAccess: false,
      })
      expect(doc.id).toBe(target.id)
    })
    it('restricts uploads to admins', async () => {
      await expectMutation(createMedia(actors[identity], false), allowed)
    })
    it('restricts updates to admins', async () => {
      const target = await createMedia()
      await expectMutation(
        payload.update({
          collection: 'media',
          id: target.id,
          data: { alt: `${prefix}-updated` },
          user: actors[identity],
          overrideAccess: false,
        }),
        allowed,
      )
    })
    it('restricts deletion to admins', async () => {
      const target = await createMedia()
      await expectMutation(
        payload.delete({
          collection: 'media',
          id: target.id,
          user: actors[identity],
          overrideAccess: false,
        }),
        allowed,
      )
    })
  })

  for (const slug of ['header', 'footer'] as const) {
    describe(`${slug}: ${identity}`, () => {
      it('keeps global content readable', async () => {
        expect(
          await payload.findGlobal({ slug, user: actors[identity], overrideAccess: false }),
        ).toBeDefined()
      })
      it('restricts updates to admins', async () => {
        const existing = await payload.findGlobal({ slug })
        await expectMutation(
          payload.updateGlobal({
            slug,
            data: { navItems: existing.navItems ?? [] },
            user: actors[identity],
            overrideAccess: false,
            context,
          }),
          allowed,
        )
      })
    })
  }

  for (const slug of ['puck-templates', 'redirects', 'search', 'payload-folders'] as const) {
    it(`${slug}: ${identity} has no implicit CMS write privilege`, async () => {
      const req = await createLocalReq({ user: actors[identity] ?? undefined }, payload)
      for (const operation of ['create', 'update', 'delete'] as const) {
        const check = payload.collections[slug].config.access[operation]
        // Search entries are created by the plugin, not by manual CMS requests.
        const expected = slug === 'search' && operation === 'create' ? false : allowed
        expect(await check!({ req })).toBe(expected)
      }
    })
  }
}

describe('Page Tree endpoints', () => {
  it.each(['anonymous', 'user'])('rejects %s before invoking tree operations', async (identity) => {
    const req = await createLocalReq({ user: actors[identity] ?? undefined }, payload)
    req.json = async () => ({})
    const endpoints = payload.config.endpoints.filter((endpoint) =>
      endpoint.path.startsWith('/page-tree/'),
    )
    expect(endpoints.length).toBeGreaterThan(0)
    for (const endpoint of endpoints) {
      const response = await endpoint.handler(req)
      expect(response?.status, endpoint.path).toBe(403)
    }
  })
})

describe('job execution', () => {
  it.each([
    ['anonymous', null, false],
    ['user', null, false],
    ['admin', null, true],
    ['anonymous', 'wrong', false],
    ['anonymous', 'valid', true],
    ['user', 'valid', true],
  ] as const)('%s with token %s -> %s', async (identity, token, expected) => {
    const saved = process.env.CRON_SECRET
    process.env.CRON_SECRET = `${prefix}-cron-secret`
    try {
      const req = await createLocalReq({ user: actors[identity] ?? undefined }, payload)
      req.headers = new Headers(
        token
          ? {
              authorization: `Bearer ${token === 'valid' ? process.env.CRON_SECRET : token}`,
            }
          : {},
      )
      expect(await canRunJobs(req)).toBe(expected)
    } finally {
      if (saved === undefined) delete process.env.CRON_SECRET
      else process.env.CRON_SECRET = saved
    }
  })
  it('denies the literal undefined bearer when CRON_SECRET is absent', async () => {
    const saved = process.env.CRON_SECRET
    delete process.env.CRON_SECRET
    try {
      const req = await createLocalReq({}, payload)
      req.headers = new Headers({ authorization: 'Bearer undefined' })
      expect(await canRunJobs(req)).toBe(false)
    } finally {
      if (saved !== undefined) process.env.CRON_SECRET = saved
    }
  })
})
