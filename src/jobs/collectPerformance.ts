import { getVaultMetricRepository } from '../db';
import { vaultPerformance } from '../vault';
import { createJob } from './helpers';

const JOB_NAME = 'collectPerformance';
const INTERVAL = 24;

export default createJob(JOB_NAME, INTERVAL, async function () {
  const repository = await getVaultMetricRepository();

  const performance = await vaultPerformance();

  const metric = repository.create({
    key: 'vault_performance',
    value: performance.toString(),
  });

  await repository.save(metric);
});
