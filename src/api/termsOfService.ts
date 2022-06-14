import { FastifyInstance, RegisterOptions } from 'fastify';

export default function (
  server: FastifyInstance,
  _opts: RegisterOptions,
  done: Function,
) {
  server.get('', async (_request, reply) => {
    return reply.sendFile('termsOfService.txt');
  });

  done();
}