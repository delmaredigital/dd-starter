'use client'

import { PuckConfigProvider } from '@delmaredigital/payload-puck/client'
import { puckConfig } from '@/puck/config'
import { puckLayouts } from '@/lib/puck/layouts'

export default function PuckProvider({ children }: { children: React.ReactNode }) {
  return (
    <PuckConfigProvider
      config={puckConfig}
      layouts={puckLayouts}
      editorStylesheets={[
        '/api/puck/styles', // Plugin-compiled CSS from editorStylesheet config
      ]}
    >
      {children}
    </PuckConfigProvider>
  )
}
