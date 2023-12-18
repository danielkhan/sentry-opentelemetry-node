
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const traceExporter = new ConsoleSpanExporter();

const {
  OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-http');

let sdks = [];

module.exports = (serviceName, sentryKey) => {

  if(sdks[serviceName]) return sdks[serviceName];
  const sdk = new NodeSDK({
    serviceName,

    
    traceExporter: new OTLPTraceExporter({
      url: `https://o1.ingest.sentry.io/api/1/spans/?sentry_key=${sentryKey}`,
      headers: {},
    }),
    
    // traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });
  sdk.start();
  sdks[serviceName] = sdk;
  return sdk;
}
