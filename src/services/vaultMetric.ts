import { getVaultMetricRepository } from '../db';
import { vaultPerformances } from '../vault';

export async function collectVaultPerformances() {
  const repository = await getVaultMetricRepository();

  const vaultMetrics = (await vaultPerformances()).map((value) =>
    repository.create({
      key: 'vault_performance',
      value: value.toString(),
    }),
  );

  await repository.save(vaultMetrics);
}
