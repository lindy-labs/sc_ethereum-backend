import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default async (server: FastifyInstance, _options: FastifyPluginOptions) => {
  server.get('', async (_request, _reply) => {
    return "There's no data for now\n";
  });
};
