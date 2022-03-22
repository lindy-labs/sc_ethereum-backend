import { logger } from 'ethers';
import { Raw } from 'typeorm';
import { getJobRepository } from '../db';

export function createJob(name: string, interval: number, fn: () => any) {
  return async () => {
    if (await alreadyRun(name, interval)) return;

    const result = await fn();

    await finishJob(name);

    return result;
  };
}

async function alreadyRun(name: string, interval: number) {
  const repository = await getJobRepository();

  const job = await repository.findOne({
    where: {
      name,
      createdAt: Raw(
        (alias) => `${alias} >= (NOW() - INTERVAL '${interval} hours')`,
      ),
    },
    order: {
      createdAt: 'DESC',
    },
  });

  return !!job;
}

async function finishJob(name: string) {
  const repository = await getJobRepository();

  await repository.save({
    name,
  });

  logger.info(`Finished running job ${name}`);
}
