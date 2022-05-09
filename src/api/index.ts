import fastify from 'fastify';

import logger from '../logger';
import { organizations } from '../organizations';
import configByNetwork from '../config';

export const server = fastify({
  logger,
});

server.get('/ping', async (_request, _reply) => {
  return 'pong\n';
});

server.get('/config', async (_request, reply) => {
  const { rpcURL, vault, graphURL } = configByNetwork();

  reply.code(200);
  reply.header('Content-Type', 'application/json');
  reply.send({
    rpcURL,
    vault,
    graphURL,
  });
});

server.get('/api/organizations', async (_request, reply) => {
  reply.status(200);
  reply.header('Content-Type', 'application/json');
  reply.send({ organizations });
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
