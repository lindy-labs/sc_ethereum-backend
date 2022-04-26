import { assert } from 'console';
import fastify from 'fastify';
import cors from 'fastify-cors';

import logger from '../logger';
import { organizations } from '../organizations';

assert(process.env.FRONTEND_URL);

export const server = fastify({
  logger,
});

server.register(cors, {
  origin: process.env.FRONTEND_URL,
  methods: ['GET'],
  // allowedHeaders: Configures the Access-Control-Allow-Headers CORS header.
  // exposedHeaders:  Configures the Access-Control-Expose-Headers CORS header.
  // credentials: Configures the Access-Control-Allow-Credentials CORS header.
  // maxAge: Configures the Access-Control-Max-Age CORS header.
  // preflightContinue: Pass the CORS preflight response to the route handler.
  // optionsSuccessStatus: Provides a status code to use for successful OPTIONS requests.
  // preflight: You can entirely disable preflight by passing false here (default: true).
  // strictPreflight: Enforces strict requirement of the CORS preflight request headers (Access-Control-Request-Method and Origin) as defined by the W3C CORS specification.
  // hideOptionsRoute: hide options route from the documentation built using fastify-swagger (default: true).
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
