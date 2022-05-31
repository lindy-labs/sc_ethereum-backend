import { VaultMetric } from './entities/vaultMetric';
import { Job } from './entities/job';
import { FoundationMetric } from './entities/foundationMetric';

import getConnection from './getConnection';

export const getFoundationMetricRepository = async () => {
  const connection = await getConnection();
  return connection.getRepository(FoundationMetric);
};

export const getVaultMetricRepository = async () => {
  const connection = await getConnection();
  return connection.getRepository(VaultMetric);
};

export const getJobRepository = async () => {
  const connection = await getConnection();
  return connection.getRepository(Job);
};

export { VaultMetric, Job };
