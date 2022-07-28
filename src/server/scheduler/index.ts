import { Job, Queue, QueueScheduler } from 'bullmq';

import * as Monitoring from '../../monitoring';
import logger from '../../logger';
import refreshOrganizations from '../../jobs/refreshOrganizations';
import redisConnection from '../../initializers/redis';
import { MetricsWorker } from '../../metrics/metricsWorker';

const SCHEDULER_QUEUE = 'ServerSchedulerQueue';
const THREE_DAYS_IN_SECONDS = 3 * 24 * 60 * 60;

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
    removeOnComplete: {
      age: THREE_DAYS_IN_SECONDS,
    },
    removeOnFail: {
      age: THREE_DAYS_IN_SECONDS,
    },
  },
});

const schedulerWorker = new MetricsWorker(
  schedulerQueue,
  async (job: Job) => {
    switch (job.name) {
      case 'refreshOrganizations':
        await refreshOrganizations(job.data, undefined);
        break;
    }
  },
  {
    connection: redisConnection,
    concurrency: 2,
  },
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
