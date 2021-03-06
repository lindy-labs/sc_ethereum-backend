import { getVaultMetricRepository } from '../db';
import { vaultPerformance } from '../contracts/vault';
import { createJob } from './helpers';

const JOB_NAME = 'collectPerformance';
const INTERVAL = 1 / 2;

export default createJob(JOB_NAME, INTERVAL, async function () {
  const repository = await getVaultMetricRepository();

  const performance = await vaultPerformance();

  const metric = repository.create({
    key: 'vault_performance',
    value: performance,
  });

  await repository.save(metric);
});
