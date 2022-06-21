import { VaultMetric } from './entities/vaultMetric';
import { Job } from './entities/job';
import { FoundationMetric } from './entities/foundationMetric';
import { Signatory } from './entities/signatory';

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

export const getSignatoryRepository = async () => {
  const connection = await getConnection();
  return connection.getRepository(Signatory);
};

export { VaultMetric, Job, getConnection, FoundationMetric };
