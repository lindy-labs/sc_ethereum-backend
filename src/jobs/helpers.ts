import { logger } from 'ethers';
import { Raw } from 'typeorm';
import { getJobRepository } from '../db';

interface Data {
  force?: boolean;
}

export function createJob(name: string, interval: number, fn: () => any) {
  return async (data: Data | null) => {
    if (!data?.force && (await alreadyRun(name, interval))) return;

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
        (alias) =>
          `DATE_TRUNC('second', ${alias}) > (DATE_TRUNC('second', NOW()) - INTERVAL '${interval} hours')`,
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
