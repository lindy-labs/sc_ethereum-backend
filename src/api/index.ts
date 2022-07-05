import fastify from 'fastify';
import cors from 'fastify-cors';
import fastifyStatic from '@fastify/static';
import path from 'path';

import logger from '../logger';
import * as Monitoring from '../monitoring';
import config from '../config';
import organizationsRoutes from './organizations';
import metricsRoutes from './metrics';
import tosRoutes from './termsOfService';

export const server = fastify({
  logger,
});

server.register(cors, {
  origin: process.env.NODE_ENV === 'development' ? '*' : /.*\.sandclock\.org$/,
  methods: ['GET'],
});

server.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  serve: false,
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

server.get('/config', async (_request, reply) => {
  const { chainID, graphURL, rpcURL, vault } = config;

  reply.code(200);
  reply.header('Content-Type', 'application/json');
  reply.send({
    chainID,
    graphURL,
    rpcURL,
    vault,
  });
});

server.register(organizationsRoutes, { prefix: '/api/organizations' });

server.register(metricsRoutes, { prefix: '/api/metrics' });

server.register(tosRoutes, { prefix: '/api/tos' });

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
