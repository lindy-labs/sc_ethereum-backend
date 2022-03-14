import { init as initVaultMetricRep } from './repositories/vaultMetric';

export * from './entities/vaultMetric';

export function initRepos() {
  initVaultMetricRep();
}
