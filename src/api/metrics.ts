import { FastifyInstance, RegisterOptions } from 'fastify';
import { Decimal } from 'decimal.js';

import {
  getFoundationMetricRepository,
  getVaultMetricRepository,
  VaultMetric,
} from '../db';

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
  server.get<{ Params: { id: string } }>(
    '/foundation/:id',
    { schema },
    async (request, reply) => {
      const { start, end } = request.query as QueryArgs;

      const repository = await getFoundationMetricRepository();

      const rawData = await repository
        .createQueryBuilder('foundation_metric')
        .select([
          'foundation_metric.shares as shares',
          'foundation_metric.amountClaimed as "amountClaimed"',
          'foundation_metric.amountDeposited as "amountDeposited"',
          'v.value as performance',
          'foundation_metric.createdAt as "createdAt"',
        ])
        .where('foundation_metric.id = :id', { id: request.params.id })
        .where('foundation_metric.createdAt >= :start', { start })
        .andWhere('foundation_metric.createdAt <= :end', { end })
        .innerJoin('foundation_metric.vaultMetric', 'v')
        .limit(MAX_RECORDS)
        .getRawMany();

      const data = rawData.map(
        ({
          shares,
          amountClaimed,
          amountDeposited,
          performance,
          createdAt,
        }) => {
          console.log({
            shares,
            amountClaimed,
            amountDeposited,
            performance,
            createdAt,
          });
          return {
            value: Decimal.max(
              0,
              new Decimal(shares)
                .mul(performance)
                .plus(amountClaimed)
                .minus(amountDeposited),
            ).toFixed(),
            createdAt,
          };
        },
      );

      reply.header('Content-Type', 'application/json');
      reply.status(200);
      reply.send({ data });
    },
  );

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
