import * as Sentry from '@sentry/node';
import Tracing from '@sentry/tracing';
import { RewriteFrames } from '@sentry/integrations';

const options = {
  attachStacktrace: true,
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new RewriteFrames({
      root: global.__dirname,
    }),
  ],
  release: `${process.env.npm_package_name}@${process.env.npm_package_version}`,
  tracesSampleRate: 1.0,
};

export function start() {
  Sentry.init(options);
}

export function stop() {
  return Sentry.close();
}

export function captureException(error: Error) {
  return Sentry.captureException(error);
}
