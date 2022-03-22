import { VaultMetric } from './entities/vaultMetric';
import { Job } from './entities/job';

import getConnection from './getConnection';

export const getVaultMetricRepository = async () => {
  const connection = await getConnection();
  return connection.getRepository(VaultMetric);
};

export const getJobRepository = async () => {
  const connection = await getConnection();
  return connection.getRepository(VaultMetric);
};

export { VaultMetric, Job };
