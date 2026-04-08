import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { Pages } from './collections/Pages'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Obscured admin path — if changing, also update:
  // - src/app/(payload)/p-kcCapdQH/ (folder name)
  // - src/app/(payload)/layout.tsx (importMap import path)
  // - src/plugins/index.ts (afterLoginPath)
  routes: {
    admin: '/p-kcCapdQH',
  },
  admin: {
    components: {
      providers: ['@/components/admin/PuckProvider'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),
  // Pages uses getPuckCollectionConfig() for explicit field/hook ownership.
  // createPuckPlugin still merges additional config (versions, edit button) at runtime.
  collections: [
    Pages,
    Posts,
    Media,
    Users,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  // Storage: using local disk (Railway volume at /app/public/media).
  // To switch to S3/R2, add @payloadcms/storage-s3 here.
  plugins: [...plugins],
  globals: [Header, Footer],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, check for
        // CRON_SECRET as a Bearer token:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
