import { Job, Queue, QueueScheduler, Worker } from 'bullmq';

import * as Monitoring from '../../monitoring';
import logger from '../../logger';

import collectPerformance from '../../jobs/collectPerformance';
import updateInvested from '../../jobs/updateInvested';
import finalizeDeposits from '../../jobs/finalizeDeposits';
import finalizeRedemptions from '../../jobs/finalizeRedemptions';
import collectFoundationsPerformance from '../../jobs/collectFoundationsPerformance';
import mintDonations from '../../jobs/mintDonations';

import redisConnection from '../../initializers/redis';

const JOBS: { [key: string]: Function } = {
  collectPerformance,
  updateInvested,
  finalizeDeposits,
  finalizeRedemptions,
  collectFoundationsPerformance,
  mintDonations,
};

const SCHEDULER_QUEUE = 'WorkerSchedulerQueue';

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
    removeOnFail: true,
  },
});

const schedulerWorker = new Worker(
  SCHEDULER_QUEUE,
  async (job: Job) => {
    if (JOBS[job.name]) await JOBS[job.name](job.data);
    else throw new Error(`Unknown job ${job.name}`);
  },
  { connection: redisConnection },
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
    every: 1000 * 60 * 60, // every hour
  },
});

schedulerQueue.add('collectFoundationsPerformance', null, {
  repeat: {
    every: 1000 * 60 * 60, // every hour
  },
});

schedulerQueue.add('finalizeDeposits', null, {
  repeat: {
    every: 1000 * 60, // every minute
  },
});

schedulerQueue.add('finalizeRedemptions', null, {
  repeat: {
    every: 1000 * 60, // every minute
  },
});

schedulerWorker.on('failed', (job: Job, err: Error) => {
  logger.error(`${job.id} failed with ${err.message}`);
  Monitoring.captureException(err);
});

export async function start() {
  schedulerQueue.add('updateInvested', null);
  schedulerQueue.add('finalizeDeposits', null);
  schedulerQueue.add('finalizeRedemptions', null);
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
