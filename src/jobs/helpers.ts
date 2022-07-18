import logger, { Logger } from '../logger';
import { Raw } from 'typeorm';
import { getJobRepository } from '../db';

interface Data {
  force?: boolean;
}

interface Context {
  logger: Logger;
}

export function createJob(
  name: string,
  interval: number,
  fn: (ctx: Context, ...args: any) => any,
) {
  const context = {
    logger: logger.child({
      job: name,
    }),
  };

  return async (data: Data | null, ...args: any) => {
    if (!data?.force && (await alreadyRun(name, interval))) return;

    const result = await fn(context, ...args);

    await finishJob(name, context);

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

async function finishJob(name: string, context: Context) {
  const repository = await getJobRepository();

  await repository.save({
    name,
  });

  context.logger.info(`Job finished`);
}
