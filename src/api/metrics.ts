import { FastifyInstance, RegisterOptions } from 'fastify';

import { getVaultMetricRepository } from '../db';

const MAX_RECORDS = 1000;

interface QueryArgs {
  start: string;
  end: string;
}

const schema = {
  querystring: {
    type: 'object',
    properties: {
      start: { type: 'string' },
      end: { type: 'string' },
    },
    required: ['start', 'end'],
  },
};

export default function (
  server: FastifyInstance,
  _opts: RegisterOptions,
  done: Function,
) {
  server.get('/day', { schema }, async (request, reply) => {
    const { start, end } = request.query as QueryArgs;

    const repository = await getVaultMetricRepository();

    const data = await repository
      .createQueryBuilder('metric')
      .select('AVG(metric.value)', 'value')
      .addSelect(`DATE_TRUNC('day', metric.createdAt)`, 'timestamp')
      .where('"createdAt" >= :start', { start })
      .andWhere('"createdAt" <= :end', { end })
      .groupBy(`timestamp`)
      .limit(MAX_RECORDS)
      .getRawMany();

    reply.header('Content-Type', 'application/json');
    reply.status(200);
    reply.send({ data });
  });

  server.get('/hour', { schema }, async (request, reply) => {
    const { start, end } = request.query as QueryArgs;

    const repository = await getVaultMetricRepository();

    const data = await repository
      .createQueryBuilder('metric')
      .select('AVG(metric.value)', 'value')
      .addSelect(`DATE_TRUNC('hour', "createdAt")`, 'timestamp')
      .where('"createdAt" >= :start', { start })
      .andWhere('"createdAt" <= :end', { end })
      .groupBy(`timestamp`)
      .limit(MAX_RECORDS)
      .getRawMany();

    reply.header('Content-Type', 'application/json');
    reply.status(200);
    reply.send({ data });
  });

  server.get('/all', { schema }, async (request, reply) => {
    const { start, end } = request.query as QueryArgs;

    const repository = await getVaultMetricRepository();

    const data = await repository
      .createQueryBuilder('metric')
      .where('"createdAt" >= :start', { start })
      .andWhere('"createdAt" <= :end', { end })
      .limit(MAX_RECORDS)
      .getMany();

    reply.header('Content-Type', 'application/json');
    reply.status(200);
    reply.send({ data });
  });

  done();
}
