// Next.js instrumentation hook — runs once per server process before any
// route/handler code. We use it to boot the OTel tracing SDK.
//
// NodeSDK is not compatible with the edge runtime, so we conditionally
// import the node-only module. Logs travel via a separate Pino transport
// (src/services/logger.ts) — this file only wires traces.
//
// Canonical pattern per Next.js docs:
// https://nextjs.org/docs/app/guides/open-telemetry#manual-opentelemetry-configuration
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node')
  }
}
