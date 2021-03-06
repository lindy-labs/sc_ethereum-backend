import { Job, Queue, QueueScheduler, Worker } from 'bullmq';

import * as Monitoring from '../../monitoring';
import logger from '../../logger';
import redisConnection from '../../initializers/redis';
import { MetricsWorker } from '../../metrics/metricsWorker';

import collectPerformance from '../../jobs/collectPerformance';
import updateInvested from '../../jobs/updateInvested';
import collectFoundationsPerformance from '../../jobs/collectFoundationsPerformance';
import mintDonations from '../../jobs/mintDonations';

const JOBS: { [key: string]: typeof collectPerformance } = {
  collectPerformance,
  updateInvested,
  collectFoundationsPerformance,
  mintDonations,
};

const SCHEDULER_QUEUE = 'WorkerSchedulerQueue';
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
    if (JOBS[job.name]) await JOBS[job.name](job.data, undefined);
    else throw new Error(`Unknown job ${job.name}`);
  },
  {
    connection: redisConnection,
    concurrency: 2,
  },
);

schedulerQueue.add('mintDonations', null, {
  repeat: {
    every: 1000 * 60 * 60, // every hour
  },
});

schedulerQueue.add('updateInvested', null, {
  repeat: {
    every: 1000 * 60 * 60, // every hour
  },
});

schedulerQueue.add('collectPerformance', null, {
  repeat: {
    every: 1000 * 60 * 30, // every half-hour
  },
});

schedulerQueue.add('collectFoundationsPerformance', null, {
  repeat: {
    every: 1000 * 60 * 60, // every hour
  },
});

schedulerWorker.on('failed', (job: Job, err: Error) => {
  logger.error(`${job.id} failed with ${err.message}`);
  Monitoring.captureException(err);
});

export async function start() {
  schedulerQueue.add('updateInvested', null);
  schedulerQueue.add('collectFoundationsPerformance', null);
  schedulerQueue.add('mintDonations', null);
  schedulerQueue.add('collectPerformance', { force: true });
}

export async function stop() {
  return await Promise.all([
    scheduler.close(),
    schedulerQueue.close(),
    schedulerWorker.close(),
  ]);
}
