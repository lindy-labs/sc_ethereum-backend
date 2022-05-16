import { Job, Queue, QueueScheduler, Worker } from 'bullmq';

import * as Monitoring from '../../monitoring';
import logger from '../../logger';
import collectPerformance from '../../jobs/collectPerformance';
import updateInvested from '../../jobs/updateInvested';
import finalizeDeposits from '../../jobs/finalizeDeposits';
import finalizeRedemptions from '../../jobs/finalizeRedemptions';
import redisConnection from '../../initializers/redis';

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
    switch (job.name) {
      case 'updateInvested':
        await updateInvested(job.data);
        break;
      case 'collectPerformance':
        await collectPerformance(job.data);
        break;
      case 'finalizeDeposits':
        await finalizeDeposits(job.data);
        break;
      case 'finalizeRedemptions':
        await finalizeRedemptions(job.data);
        break;
    }
  },
  { connection: redisConnection },
);

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

schedulerWorker.on('completed', (job: Job, err: Error) => {
  logger.info(`${job.id} has been completed!`);
});

schedulerWorker.on('failed', (job: Job, err: Error) => {
  logger.error(`${job.id} has failed with ${err.message}`);
  Monitoring.captureException(err);
});

export async function start() {
  schedulerQueue.add('updateInvested', null);
  schedulerQueue.add('finalizeDeposits', null);
  schedulerQueue.add('finalizeRedemptions', null);
  schedulerQueue.add('collectPerformance', { force: true });
}

export async function stop() {
  return await Promise.all([
    scheduler.close(),
    schedulerQueue.close(),
    schedulerWorker.close(),
  ]);
}
