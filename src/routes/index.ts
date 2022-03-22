import { FastifyInstance } from "fastify";

import OrganizationsRoutes from "./organizations";

export function initRoutes(server: FastifyInstance) {
  server.register(OrganizationsRoutes, { prefix: "/api/organizations" });
};
