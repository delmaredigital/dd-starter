import pino from 'pino'

const isDev = process.env.NODE_ENV === 'development'
// Pretty-print only locally. Railway dev has NODE_ENV=development but needs
// single-line JSON — multi-line pretty output gets split into separate log entries.
const isLocal = !process.env.RAILWAY_SERVICE_ID

export const logger = pino({
  // LOG_LEVEL env override for ad-hoc prod debugging without redeploy
  level: process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info'),
  ...(isLocal
    ? { transport: { target: 'pino-pretty' } }
    : {
        transport: {
          targets: [
            // Keep stdout so Railway's built-in log viewer stays populated.
            { target: 'pino/file', options: { destination: 1 } },
            // Ship same log records to the OTel Collector → VictoriaLogs.
            {
              target: 'pino-opentelemetry-transport',
              options: {
                loggerName: 'payload-cms',
                serviceVersion: process.env.npm_package_version ?? 'unknown',
                logRecordProcessorOptions: {
                  recordProcessorType: 'batch',
                  exporterOptions: {
                    protocol: 'http/protobuf',
                    protobufExporterOptions: {
                      url: 'http://collector.railway.internal:4318/v1/logs',
                    },
                  },
                },
              },
            },
          ],
        },
      }),
})
