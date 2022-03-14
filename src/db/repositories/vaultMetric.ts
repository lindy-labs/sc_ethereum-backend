import { getRepository, Repository } from 'typeorm';

import { VaultMetric } from '../entities/vaultMetric';

export let repository: Repository<VaultMetric>;

export function init() {
  repository = getRepository(VaultMetric);
}
