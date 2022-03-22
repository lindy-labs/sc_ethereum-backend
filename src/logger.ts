import Pino from 'pino';

export default Pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      prettyPrint:
        process.env.NODE_ENV !== 'development'
          ? {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            }
          : false,
    },
  },
});
