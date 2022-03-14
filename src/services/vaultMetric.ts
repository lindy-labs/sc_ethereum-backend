import repository from '../db/repositories/vaultMetric';
import { vaultPerformances } from '../vault';

export async function collectVaultPerformances() {
  const values = await vaultPerformances();

  const vaultMetrics = values.map((value) =>
    repository.create({
      key: 'vault_performance',
      value: value.toString(),
    }),
  );

  await repository.save(vaultMetrics);
}
