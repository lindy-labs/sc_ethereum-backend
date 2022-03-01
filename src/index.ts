import fastify from 'fastify';
import { getTotalShares, vaults } from './vault';

const server = fastify({
  logger: {
    prettyPrint:
      process.env.NODE_ENV !== 'development'
        ? {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          }
        : false,
  },
});

server.get('/ping', async (_request, _reply) => {
  return 'pong\n';
});

server.listen(process.env.PORT || 8080, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  server.log.debug(`Server listening at ${address}`);
});
