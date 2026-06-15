import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Poppins, Baskervville } from 'next/font/google'
import React from 'react'

// Global Header/Footer (src/Header, src/Footer) removed from layout.
// They are Payload globals — editable at /<admin-path>/globals/header and /<admin-path>/globals/footer.
// Removed because competition pages use their own CompetitionNav and CompetitionFooter
// Puck components instead. The Payload global components and their config still exist
// in the codebase — re-add here if non-competition pages need a site-wide header/footer.
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins-src',
  display: 'swap',
})

const baskervville = Baskervville({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  variable: '--font-baskervville-src',
  display: 'swap',
})
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable, poppins.variable, baskervville.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        {/* Favicon and apple-touch-icon handled by Next.js file conventions: app/favicon.ico, app/apple-icon.png */}
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
        <GoogleAnalytics gaId="G-L8FBH1DRJR" />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
