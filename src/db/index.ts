import { init as initVaultMetricRepository } from './repositories/vaultMetric';

export * from './entities/vaultMetric';

export function initRepos() {
  initVaultMetricRepository();
}
