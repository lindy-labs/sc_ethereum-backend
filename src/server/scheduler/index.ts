import { Job, Queue, QueueScheduler, Worker } from 'bullmq';

import * as Monitoring from '../../monitoring';
import logger from '../../logger';
import refreshOrganizations from '../../jobs/refreshOrganizations';
import redisConnection from '../../initializers/redis';

const SCHEDULER_QUEUE = 'ServerSchedulerQueue';

const scheduler = new QueueScheduler(SCHEDULER_QUEUE, {
  connection: redisConnection,
});

const schedulerQueue = new Queue(SCHEDULER_QUEUE, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: true,
  },
});

const schedulerWorker = new Worker(
  SCHEDULER_QUEUE,
  async (job: Job) => {
    switch (job.name) {
      case 'refreshOrganizations':
        await refreshOrganizations(job.data);
        break;
    }
  },
  { connection: redisConnection },
);

schedulerQueue.add('refreshOrganizations', null, {
  repeat: {
    every: 1000 * 60 * 60 * 4, // every 4 hours
  },
});

schedulerWorker.on('failed', (job: Job, err: Error) => {
  logger.error(`${job.id} failed with ${err.message}`);
  Monitoring.captureException(err);
});

export async function start() {
  schedulerQueue.add('refreshOrganizations', { force: true });
}

export async function stop() {
  return await Promise.all([
    scheduler.close(),
    schedulerQueue.close(),
    schedulerWorker.close(),
  ]);
}
