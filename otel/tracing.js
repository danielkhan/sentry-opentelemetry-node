const {SentrySpanProcessor, SentryPropagator} = require('@sentry/opentelemetry-node');

const { node } = require('@opentelemetry/sdk-node');

const { NodeTracerProvider } = node;

const opentelemetry = require('@opentelemetry/api');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { ConsoleSpanExporter, BatchSpanProcessor, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const jaegerExporter = new JaegerExporter();



const process = require('process');

let sdks = [];

module.exports = (serviceName) => {

  if(sdks[serviceName]) return sdks[serviceName];

  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter));
  provider.addSpanProcessor(new SentrySpanProcessor());
  provider.register();
  registerInstrumentations({
    instrumentations: getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-fs": {
        enabled: false,
      },
    }),
  });

  return opentelemetry.trace.getTracer(serviceName);

  // configure the SDK to export telemetry data to the console
  // enable all auto-instrumentations from the meta package
  // const traceExporter = new ConsoleSpanExporter();
  /*
  const sdk = sdks[serviceName] = new opentelemetry.NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
    //traceExporter,
    spanProcessor: new SimpleSpanProcessor(jaegerExporter),
    // spanProcessor: new SentrySpanProcessor(),
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
  sdk.start()
    .then(() => console.log(`Tracing initialized for service [${serviceName}]`))
    .catch((error) => console.log(`Error initializing tracing for service [${serviceName}]`, error));

  // gracefully shut down the SDK on process exit
  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log(`Tracing for service [${serviceName}] terminated`))
      .catch((error) => console.log(`Error terminating tracing for service [${serviceName}]`, error))
      .finally(() => process.exit(0));
  });

  return sdk;
    */
}
