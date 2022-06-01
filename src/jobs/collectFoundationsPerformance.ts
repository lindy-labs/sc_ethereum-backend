import { request, gql } from 'graphql-request';

import config from '../config';
import { createJob } from './helpers';
import { getFoundationMetricRepository } from '../db';

const query = gql`
  {
    foundations {
      id
      amountDeposited
      shares
      amountClaimed
    }
  }
`;

interface RawFoundation {
  id: string;
  amountDeposited: string;
  shares: string;
  amountClaimed: string;
}

interface Response {
  foundations: RawFoundation[];
}

const JOB_NAME = 'collectFoundationsPerformance';
const INTERVAL = 12;

export default createJob(JOB_NAME, INTERVAL, async function () {
  const repository = await getFoundationMetricRepository();

  const { foundations }: Response = await request(config.graphURL, query);

  await Promise.all(
    foundations.map(async (foundation) => {
      const metric = repository.create({
        foundation: foundation.id,
        amountClaimed: foundation.amountClaimed,
        amountDeposited: foundation.amountDeposited,
        shares: foundation.shares,
      });

      await repository.save(metric);
    }),
  );
});
