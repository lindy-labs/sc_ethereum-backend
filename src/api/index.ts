import fastify from 'fastify';
import cors from 'fastify-cors';

import logger from '../logger';
import * as Monitoring from '../monitoring';
import { organizations } from '../organizations';

export const server = fastify({
  logger,
});

server.register(cors, {
  origin: process.env.NODE_ENV === 'development' ? '*' : /\*.sandclock.org/,
  methods: ['GET'],
});

server.setErrorHandler(async (error, request, reply) => {
  request.log.error(error);

  if (!error.statusCode || error.statusCode! >= 500)
    Monitoring.captureException(error);

  if (process.env.NODE_ENV === 'production')
    error.message = 'Internal Server Error';

  reply.send(error);
});

server.get('/ping', async (_request, _reply) => {
  return 'pong\n';
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
