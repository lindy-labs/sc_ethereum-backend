import fastify from 'fastify';

import logger from '../logger';
import { organizations, ttl } from '../organizations';

export const server = fastify({
  logger,
});

server.get('/ping', async (_request, _reply) => {
  return 'pong\n';
});

server.get('/api/organizations', async (_request, reply) => {
  reply.status(200);
  reply.header('Content-Type', 'application/json');
  reply.header('Cache-Control', `max-age:${ttl - Date.now()}`);
  reply.send({ organizations: organizations });
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
