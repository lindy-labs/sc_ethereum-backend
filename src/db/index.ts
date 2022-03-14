export * from './entities/vaultMetric';
import { init as initVaultMetricRepository } from './repositories/vaultMetric';

export function initRepos() {
  initVaultMetricRepository();
}
