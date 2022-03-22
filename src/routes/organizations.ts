import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getOrganizationsList } from "../services/givingBlockProxy";

export default async (server: FastifyInstance, _options: FastifyPluginOptions) => {
  server.get('', async (_request, reply) => {
    const organizations = await getOrganizationsList();

    reply.status(200);
    reply.header( "Content-Type", "application/json");
    reply.send({organizations: organizations});
  });
};
