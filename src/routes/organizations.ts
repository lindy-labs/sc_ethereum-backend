import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getOrganizationsList, getOrganizationsListTTL } from "../services/givingBlockProxy";

export default async (server: FastifyInstance, _options: FastifyPluginOptions) => {
  server.get('', async (_request, reply) => {
    const organizations = getOrganizationsList();
    const ttl = getOrganizationsListTTL();

    reply.status(200);
    reply.header("Content-Type", "application/json");
    reply.header("Cache-Control", `max-age:${ttl}`);
    reply.send({ organizations: organizations });
  });
};
