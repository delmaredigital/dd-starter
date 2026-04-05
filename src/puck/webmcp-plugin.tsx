'use client'

import { useEffect } from 'react'
import { useGetPuck } from '@puckeditor/core'
import type { Plugin } from '@puckeditor/core'
import { registerTools, unregisterTools, type AgentTool } from '@/lib/webmcp/registry'
import {
  createGetPageStateTool,
  createGetComponentSchemaTool,
  createUpdatePageTool,
  createUpdateRootPropsTool,
  createUploadImageTool,
  createSavePageTool,
  type PuckStateAccessors,
} from '@/lib/webmcp/tools'

function WebMCPToolRegistration() {
  // useGetPuck returns a stable getState function — no re-renders on state change
  const getStore = useGetPuck()

  useEffect(() => {
    const accessors: PuckStateAccessors = {
      getState: () => ({ data: getStore().appState.data }),
      dispatch: (action) => getStore().dispatch(action),
      getConfig: () => getStore().config,
    }

    // TODO: validate agent input with zod — tool execute params come from an external
    // boundary (agent sends JSON over CDP) and are currently unvalidated.
    // The cast exists because tool factories type execute params specifically
    // (e.g. { puckData: Data }) but AgentTool.execute accepts Record<string, unknown>.
    const tools = [
      createGetPageStateTool(accessors),
      createGetComponentSchemaTool(accessors),
      createUpdatePageTool(accessors),
      createUpdateRootPropsTool(accessors),
      createUploadImageTool(accessors),
      createSavePageTool(accessors),
    ] as AgentTool[]

    registerTools(tools)

    return () => {
      unregisterTools()
    }
  }, [getStore])

  return null
}

export const webmcpPlugin: Plugin = {
  name: 'webmcp-tools',
  overrides: {
    puck: ({ children }: { children: React.ReactNode }) => {
      return (
        <>
          <WebMCPToolRegistration />
          {children}
        </>
      )
    },
  },
}
