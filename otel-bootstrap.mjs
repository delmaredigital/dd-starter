// OTel bootstrap — preloaded via `node --import ./otel-bootstrap.mjs` (set
// through NODE_OPTIONS in package.json's start script).
//
// Why this file exists (read before modifying):
//
// Next.js's standard instrumentation.ts hook runs LATE — after Node has
// already loaded `http` and other core modules. By that time,
// instrumentation-http's require-hook monkey-patching can no longer
// intercept the module, so http.server.request.duration metrics never
// emit. The canonical community workaround (vercel/next.js#80262) is to
// preload OTel via Node's --import flag BEFORE any application code:
//
//   node --import ./otel-bootstrap.mjs .next/server.js
//
// Or equivalently, via NODE_OPTIONS when running `next start`, which spawns
// node and inherits the options. That's what package.json uses here.
//
// This file mirrors algoed-new/src/telemetry.ts in structure and intent —
// both services converge on the spec-native metric path:
//   - http.server.request.duration  (instrumentation-http, incoming)
//   - http.client.request.duration  (instrumentation-http, outgoing)
//   - db.client.operation.duration  (instrumentation-pg, Postgres)
//
// @vercel/otel is NOT used. It was intentionally retired when this file
// landed — see the git log around this commit for the reasoning.
//
// OTEL_SEMCONV_STABILITY_OPT_IN: forces stable semconv names (http.request.method,
// db.query.text, …) instead of legacy (http.method, db.statement).
// TODO(delete-by-2026-Q3): OTel JS SDK v3 (targeted June 2026) makes stable
// semconv the default and REMOVES this flag entirely.
// https://opentelemetry.io/docs/specs/semconv/non-normative/http-migration/
process.env.OTEL_SEMCONV_STABILITY_OPT_IN ??= 'database,http';

// Enable ALL NodeSDK resource detectors (host, os, service-instance,
// process, env). Default is only [env, process, host] — misses
// serviceInstanceIdDetector (needed for multi-replica) and osDetector.
// "all" is future-proof: any detector a later SDK version registers flows
// through automatically. Churny/uninformative attrs (host.name,
// process.pid, process.command_args, etc.) are stripped at the Collector
// via resource/strip_junk — see algoed-new/observability/otel-collector.yaml
// (shared collector config across all algoed services).
process.env.OTEL_NODE_RESOURCE_DETECTORS ??= 'all';

// Register the ESM loader hook so @opentelemetry/instrumentation can patch
// packages that are ESM-imported (e.g. Payload's @payloadcms/db-postgres
// does `import pgDependency from 'pg'`, which bypasses `require-in-the-middle`).
// Without this, instrumentation-pg, instrumentation-mysql2, etc. never fire
// for modules loaded through Node's ESM loader. module.register is stable in
// Node 24+ (we require ">=24" in package.json, so no experimental flag needed).
// https://github.com/open-telemetry/opentelemetry-js/blob/main/doc/esm-support.md
import { register } from 'node:module';
register('@opentelemetry/instrumentation/hook.mjs', import.meta.url);

// ═══════════════ DIAGNOSTIC (temporary) ═══════════════
// Re-enable DEBUG diag logging to see whether instrumentation-pg's
// patch is firing. Remove once DB metrics confirmed flowing.
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
// ══════════════════════════════════════════════════════

// Known limitation: `http.server.request.duration` is emitted by
// instrumentation-http WITHOUT the `http.route` label. Root cause:
// instrumentation-http reads `http.route` from RPCMetadata on the active
// context at metric-record time, and Next.js does not populate that path
// (Next.js sets `next.route` on its own spans instead, which is separate
// from what instrumentation-http reads). Per OTel spec, instrumentations
// MUST NOT inject URL path as a fallback for http.route — missing is the
// spec-correct state when the framework can't supply a low-cardinality
// route. Per-route RED for pages-cms lives in the trace viewer (filter
// spans by `next.route`) until the official fix ships.
// Tracked upstream in opentelemetry-js#5135 (metric-attribute hook, blocked
// on cardinality-safety prerequisites #4095 + #4096). When that lands,
// wire `incomingRequestMetricAttributeHook` in the instrumentations
// config below to pull route into the histogram.

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AlwaysOnSampler } from '@opentelemetry/sdk-trace-base';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_NAMESPACE,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { ATTR_DEPLOYMENT_ENVIRONMENT_NAME } from '@opentelemetry/semantic-conventions/incubating';

const sdk = new NodeSDK({
  // App-known resource attrs. Auto-detected attrs (host.arch,
  // service.instance.id, process.runtime.*, etc.) merge on top via the
  // detectors enabled above.
  //
  // Note: AWS/GCP/Azure ship official @opentelemetry/resource-detector-*
  // packages that auto-map platform env vars to OTel attrs. No Railway
  // equivalent exists (may never ship — smaller ecosystem), so the
  // RAILWAY_* reads below are hand-rolled glue. If
  // @opentelemetry/resource-detector-railway ever lands, this is where
  // you'd swap it in.
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'payload-cms',
    [ATTR_SERVICE_NAMESPACE]: 'algoed',
    [ATTR_SERVICE_VERSION]:
      process.env.RAILWAY_GIT_COMMIT_SHA ??
      process.env.npm_package_version ??
      'unknown',
    [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]:
      process.env.RAILWAY_ENVIRONMENT_NAME ?? 'local',
  }),

  // AlwaysOnSampler — 100% trace capture, sampler-independent metrics.
  // Native http.server/.client.request.duration and
  // db.client.operation.duration don't depend on this; it's for full
  // fidelity when clicking through from a metric spike to its traces.
  sampler: new AlwaysOnSampler(),

  traceExporter: new OTLPTraceExporter({
    url: 'http://collector.railway.internal:4318/v1/traces',
  }),

  // Auto-instrumentations patches http, fs, pg, dns, etc. via Node's
  // module-loading hooks. Works here because --import preloads this file
  // BEFORE Next.js evaluates next.config.ts or requires 'http'. See the
  // top-of-file note on the vercel/next.js#80262 ordering constraint.
  instrumentations: [getNodeAutoInstrumentations()],

  // Native metrics pipeline. Histograms emitted directly by:
  //   - instrumentation-http → http.server.request.duration,
  //                             http.client.request.duration
  //   - instrumentation-pg → db.client.operation.duration
  // Collector forwards app → otlp → VictoriaMetrics; no spanmetrics
  // derivation anywhere in the stack for this service.
  //
  // Default export interval is 60s; override via OTEL_METRIC_EXPORT_INTERVAL.
  metricReaders: [
    new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: 'http://collector.railway.internal:4318/v1/metrics',
      }),
    }),
  ],
});

sdk.start();
