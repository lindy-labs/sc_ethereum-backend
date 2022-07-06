import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import { organizations } from '../organizations';

export default async function (
  server: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  server.get('', async (_request, reply) => {
    if (organizations.length === 0) {
      reply.status(503);
      reply.header('Content-Type', 'application/json');
      return reply.send();
    }

    reply.status(200);
    reply.header('Content-Type', 'application/json');
    reply.send({ organizations });
  });
}
