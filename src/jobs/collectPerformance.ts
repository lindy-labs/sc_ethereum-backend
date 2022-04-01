import { getVaultMetricRepository } from '../db';
import { vaultPerformances } from '../vault';
import { createJob } from './helpers';

const JOB_NAME = 'collectPerformance';
const INTERVAL = 24;

export default createJob(JOB_NAME, INTERVAL, async function () {
  const repository = await getVaultMetricRepository();

  const vaultMetrics = (await vaultPerformances()).map((value) =>
    repository.create({
      key: 'vault_performance',
      value: value.toString(),
    }),
  );

  await repository.save(vaultMetrics);
});
