import repository from '../db/repositories/vaultMetric';
import { vaultPerformances } from '../vault';

async function collectMetrics(key: string, fn: () => Promise<string[]>) {
  const values = await fn();

  const vaultMetrics = values.map((value) =>
    repository.create({
      key,
      value,
    }),
  );

  await repository.save(vaultMetrics);
}

export async function collectVaultPerformances() {
  await collectMetrics('vault_performance', vaultPerformances);
}
