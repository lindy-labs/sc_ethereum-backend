import { Job, Queue, QueueScheduler, Worker } from 'bullmq';

import logger from '../logger';
import collectPerformance from '../jobs/collectPerformance';
import updateInvested from '../jobs/updateInvested';

const SCHEDULER_QUEUE = 'SchedulerQueue';

const options = {
  connection: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
};

const scheduler = new QueueScheduler(SCHEDULER_QUEUE, options);
const schedulerQueue = new Queue(SCHEDULER_QUEUE, options);

const schedulerWorker = new Worker(
  SCHEDULER_QUEUE,
  async (job: Job) => {
    switch (job.name) {
      case 'updateInvested':
        await updateInvested();
        break;
      case 'vaultPerformance':
        await collectPerformance();
        break;
    }
  },
  options,
);

schedulerQueue.add('updateInvested', null, {
  repeat: {
    cron: '0 * * * * *',
  },
});

schedulerQueue.add('vaultPerformance', null, {
  repeat: {
    cron: '0 * * * * *',
  },
});

schedulerWorker.on('completed', (job: Job, err: Error) => {
  logger.info(`${job.id} has been completed!`);
});

schedulerWorker.on('failed', (job: Job, err: Error) => {
  logger.error(`${job.id} has failed with ${err.message}`);
});

export async function start() {
  schedulerQueue.add('updateInvested', null, {});
  schedulerQueue.add('vaultPerformance', null, {});
}

export async function stop() {
  return await Promise.all([
    scheduler.close(),
    schedulerQueue.close(),
    schedulerWorker.close(),
  ]);
}
