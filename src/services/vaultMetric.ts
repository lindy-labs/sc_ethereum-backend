import { vaultMetricsRep } from '../db/repositories/vaultMetric';

export async function collectMetric(key: string, fn: () => Promise<string>) {
  const value = await fn();

  const vaultMetric = vaultMetricsRep.create({
    key,
    value,
  });

  vaultMetricsRep.save(vaultMetric);
}

export async function collectMetrics(key: string, fn: () => Promise<string[]>) {
  const values = await fn();

  const vaultMetrics = values.map(value => vaultMetricsRep.create({
    key,
    value,
  }));

  vaultMetricsRep.save(vaultMetrics);
}
