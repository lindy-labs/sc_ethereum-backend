import { getRepository, Repository } from 'typeorm';
import { VaultMetric } from '../entities/vaultMetric';

export const vaultMetricsRep: Repository<VaultMetric> = getRepository(VaultMetric);
