import { request, gql } from 'graphql-request';

import { vaultPerformance } from '../contracts/vault';
import config from '../config';
import { createJob } from './helpers';
import { getConnection, VaultMetric, FoundationMetric } from '../db';

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
  const { foundations }: Response = await request(config.graphURL, query);

  const foundaionMetricsRaw = await Promise.all(
    foundations.map(async (foundation) => ({
      foundation: foundation.id,
      amountClaimed: foundation.amountClaimed,
      amountDeposited: foundation.amountDeposited,
      shares: foundation.shares,
    })),
  );

  const vaultMetricRaw = {
    key: 'vault_performance',
    value: await vaultPerformance(),
  };

  const connection = await getConnection();

  await connection.transaction(async (transactionalEntityManager) => {
    const vaultMetric = await transactionalEntityManager
      .getRepository(VaultMetric)
      .save(vaultMetricRaw);

    await transactionalEntityManager.getRepository(FoundationMetric).save(
      foundaionMetricsRaw.map((foundation) => ({
        ...foundation,
        vaultMetric: vaultMetric,
      })),
    );
  });

  console.log('done');
});
