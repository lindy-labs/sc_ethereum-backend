import { FastifyInstance, RegisterOptions } from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';

export default function (
  server: FastifyInstance,
  _opts: RegisterOptions,
  done: Function,
) {
  server.register(fastifyStatic, {
    root: path.join(__dirname, '../public/termsOfService'),
  });

  server.get('', async (_request, reply) => {
    return reply.sendFile('test.txt');
  });

  done();
}