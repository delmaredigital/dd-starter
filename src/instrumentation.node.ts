// OTel tracing bootstrap. Imported at top of src/instrumentation.ts so
// auto-instrumentations patch http / undici / pg at module load time,
// BEFORE Next.js loads them. See instrumentation.ts for the ordering
// explanation and the vercel/next.js#80262 reference.
//
// OTEL_SEMCONV_STABILITY_OPT_IN controls which semantic convention
// attribute names our instrumentations emit.
//   unset        → OLD names only
//   "database,http" → NEW stable names only ← what we use, matches algoed-new
//
// Our Collector (algoed-new/observability/otel-collector.yaml) keys
// spanmetrics on the NEW names. "database,http" emits those only — no
// redundant old-convention attrs.
process.env.OTEL_SEMCONV_STABILITY_OPT_IN ??= 'database,http'

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { AlwaysOnSampler } from '@opentelemetry/sdk-trace-base'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

const sdk = new NodeSDK({
  // service.name: labels all spans, used as a dimension in the spanmetrics connector
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'payload-cms',
  }),
  // AlwaysOnSampler (flat, not ParentBased) — ignores upstream sampling
  // decisions. Required for our spec of "no sampling, full-population metrics".
  sampler: new AlwaysOnSampler(),
  // OTLP HTTP protobuf exporter pointing at the Collector's private Railway domain.
  // Full URL with /v1/traces path (NodeSDK constructor does not auto-append).
  traceExporter: new OTLPTraceExporter({
    url: 'http://collector.railway.internal:4318/v1/traces',
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      // Next.js emits its own route-aware HTTP server spans via
      // BaseServer.handleRequest. instrumentation-http's server-side span
      // would duplicate and lack next.route context — disable it.
      // instrumentation-http still handles OUTGOING HTTP for client spans.
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingRequestHook: () => true,
      },
    }),
  ],
  // metricReader omitted → metrics SDK not initialized. Metrics are derived
  // at the Collector from span-metrics connector.
  // logRecordProcessors omitted → logs travel via Pino OTel transport
  // (src/services/logger.ts), not through this SDK.
})

sdk.start()
