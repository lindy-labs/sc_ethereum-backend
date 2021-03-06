import Pino from 'pino';
import type P from 'pino';

export type Logger = P.Logger;

const baseOptions = {
  level: 'info',
  timestamp: false,
  formatters: {
    level(level: string) {
      return { status: level };
    },
    bindings() {
      return {};
    },
  },
};

export default Pino(
  process.env.NODE_ENV === 'production'
    ? baseOptions
    : {
        ...baseOptions,
        prettyPrint: {
          colorize: true,
          sync: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'time,pid,hostname',
          hideObject: true,
          messageFormat: (log, messageKey, _levelLabel) => {
            if (log.job) return `(JOB) ${log.job} - ${log[messageKey]}`;

            return `${log[messageKey]}`;
          },
        },
      },
);
