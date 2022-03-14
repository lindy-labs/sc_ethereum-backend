import { repository } from '../db/repositories/vaultMetric';

export async function collectMetrics(key: string, fn: () => Promise<string[]>) {
  const values = await fn();

  const vaultMetrics = values.map((value) =>
    repository.create({
      key,
      value,
    }),
  );

  await repository.save(vaultMetrics);
}
