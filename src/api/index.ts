import fastify from 'fastify';

import logger from '../logger';

export const server = fastify({
  logger,
});

server.get('/ping', async (_request, _reply) => {
  return 'pong\n';
});

export function start() {
  return new Promise((resolve, reject) => {
    server.listen(process.env.PORT || 8080, '0.0.0.0', (err, address) => {
      if (err) {
        return reject(err);
      }

      server.log.debug(`Server listening at ${address}`);

      resolve(server);
    });
  });
}
