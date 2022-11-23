const {SentrySpanProcessor, SentryPropagator} = require('@sentry/opentelemetry-node');

const process = require('process');
const opentelemetry = require('@opentelemetry/sdk-node');
const otelApi = require('@opentelemetry/api');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
let sdks = [];

module.exports = (serviceName) => {

  if(sdks[serviceName]) return sdks[serviceName];

  // configure the SDK to export telemetry data to the console
  // enable all auto-instrumentations from the meta package
  const traceExporter = new ConsoleSpanExporter();
  sdks[serviceName] = new opentelemetry.NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
    //traceExporter,
    spanProcessor: new SentrySpanProcessor(),
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-fs": {
          enabled: false,
        },
      }),
    ],
  });

  otelApi.propagation.setGlobalPropagator(new SentryPropagator());
  

  // initialize the SDK and register with the OpenTelemetry API
  // this enables the API to record telemetry
  sdks[serviceName].start()
    .then(() => console.log(`Tracing initialized for service [${serviceName}]`))
    .catch((error) => console.log(`Error initializing tracing for service [${serviceName}]`, error));

  // gracefully shut down the SDK on process exit
  process.on('SIGTERM', () => {
    sdks[serviceName].shutdown()
      .then(() => console.log(`Tracing for service [${serviceName}] terminated`))
      .catch((error) => console.log(`Error terminating tracing for service [${serviceName}]`, error))
      .finally(() => process.exit(0));
  });

  return sdks[serviceName];
}
