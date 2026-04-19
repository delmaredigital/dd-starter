// Next.js instrumentation hook.
//
// The SDK is loaded at MODULE TOP LEVEL rather than inside register(),
// on purpose — register() runs lazily on first request, which is AFTER
// Next.js has already loaded core modules (http, undici, fs). Auto-
// instrumentations require patching those before load, so booting them
// from inside register() is too late and HTTP server metrics never emit.
//
// Top-level import runs at instrumentation.ts load time, which happens
// earlier in Next.js's boot sequence — before the server is constructed.
// Pattern reported by stephenliang and confirmed by others in
// https://github.com/vercel/next.js/issues/80262 as the fix for missing
// http.server.request.duration metrics.
//
// Only applies to Node runtime; Edge runtime does not support NodeSDK.
if (process.env.NEXT_RUNTIME === 'nodejs') {
  await import('./instrumentation.node')
}

// register() is required by Next.js but we have nothing to do here —
// SDK boot already happened at module top level above.
export function register() {}
