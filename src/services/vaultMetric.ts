import repository from '../db/repositories/vaultMetric';
import { vaultPerformances } from '../vault';

export async function collectVaultPerformances() {
  const vaultMetrics = (await vaultPerformances()).map((value) =>
    repository.create({
      key: 'vault_performance',
      value: value.toString(),
    }),
  );

  await repository.save(vaultMetrics);
}
