import { getRepository, Repository } from 'typeorm';

import { VaultMetric } from '../entities/vaultMetric';

let repository: Repository<VaultMetric>;

export function init() {
  repository = getRepository(VaultMetric);
}

export { repository as default };
