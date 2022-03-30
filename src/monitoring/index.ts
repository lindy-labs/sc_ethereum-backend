import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

const options = {
  dsn: process.env.SENTRY_DSN,

  // Between 0 and 1, to capture between 0% and 100% 
  // of transactions for performance monitoring.
  tracesSampleRate: 1.0,
}

export function start() {
  Sentry.init(options);
}