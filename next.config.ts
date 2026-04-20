import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'
import { withPuckCSS } from '@delmaredigital/payload-puck/next'

import redirects from './redirects'

const NEXT_PUBLIC_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const nextConfig: NextConfig = {
  // Keep `pg` as a runtime ESM import instead of bundling into webpack output.
  // Required alongside the module.register hook in otel-bootstrap.mjs for
  // @opentelemetry/instrumentation-pg to patch pg — if pg is bundled,
  // there's no runtime import for the ESM hook to intercept. Empirically
  // verified: either fix alone is insufficient; both together emit
  // db.client.operation.duration metrics.
  serverExternalPackages: ['pg', 'drizzle-orm', '@payloadcms/drizzle'],
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
        }
      }),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
}

export default withPuckCSS({
  cssInput: 'src/app/(frontend)/globals.css',
})(withPayload(nextConfig, { devBundleServerPackages: false }))
