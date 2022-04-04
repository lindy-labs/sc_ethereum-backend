import { Job, Queue, QueueScheduler, Worker } from 'bullmq';
import Redis from 'ioredis';
import * as Monitoring from '../monitoring';

import logger from '../logger';
import collectPerformance from '../jobs/collectPerformance';
import updateInvested from '../jobs/updateInvested';
import refreshOrganizations from '../jobs/refreshOrganizations';

const SCHEDULER_QUEUE = 'SchedulerQueue';

const redisOptions: Redis.RedisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

const connection = new Redis(
  process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  redisOptions,
);

const options = {
  connection,
};

const scheduler = new QueueScheduler(SCHEDULER_QUEUE, options);
const schedulerQueue = new Queue(SCHEDULER_QUEUE, options);

const schedulerWorker = new Worker(
  SCHEDULER_QUEUE,
  async (job: Job) => {
    switch (job.name) {
      case 'updateInvested':
        // await updateInvested();
        break;
      case 'vaultPerformance':
        await collectPerformance();
        break;
      case 'refreshOrganizations':
        await refreshOrganizations();
        break;
    }
  },

  options,
);

schedulerQueue.add('updateInvested', null, {
  repeat: {
    every: 1000 * 60 * 60, // every hour
  },
  jobId: 'updateInvested',
});

schedulerQueue.add('vaultPerformance', null, {
  repeat: {
    every: 1000 * 60 * 60, // every hour
  },
  jobId: 'vaultPerformance',
});

schedulerQueue.add('refreshOrganizations', null, {
  repeat: {
    every: 1000 * 60 * 60 * 4, // every 4 hours
  },
  jobId: 'refreshOrganizations',
});

schedulerWorker.on('completed', (job: Job, err: Error) => {
  logger.info(`${job.id} has been completed!`);
});

schedulerWorker.on('failed', (job: Job, err: Error) => {
  logger.error(`${job.id} has failed with ${err.message}`);
  Monitoring.captureException(err);
});

export async function start() {
  schedulerQueue.add('updateInvested', null, {});
  schedulerQueue.add('vaultPerformance', null, {});
  schedulerQueue.add('refreshOrganizations', null, {});
}

export async function stop() {
  return await Promise.all([
    scheduler.close(),
    schedulerQueue.close(),
    schedulerWorker.close(),
  ]);
}
