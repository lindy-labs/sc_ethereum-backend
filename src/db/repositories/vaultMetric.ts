import { getRepository, Repository } from 'typeorm';
import { VaultMetric } from '../entities/vaultMetric';
import getConnection from '../getConnection';

export let vaultMetricsRep: Repository<VaultMetric>;

getConnection().then(async (newConnection) => {
  vaultMetricsRep = getRepository(VaultMetric);
});
