import { Job, Queue, QueueScheduler, Worker } from 'bullmq';
import Redis from 'ioredis';
import * as Monitoring from '../monitoring';

import logger from '../logger';
import collectPerformance from '../jobs/collectPerformance';
import updateInvested from '../jobs/updateInvested';
import refreshOrganizations from '../jobs/refreshOrganizations';
import finalizeDeposits from '../jobs/finalizeDeposits';
import finalizeRedemptions from '../jobs/finalizeRedemptions';

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
        await updateInvested(job.data);
        break;
      case 'vaultPerformance':
        await collectPerformance(job.data);
        break;
      case 'refreshOrganizations':
        await refreshOrganizations(job.data);
        break;
      case 'finalizeDeposits':
        await finalizeDeposits(job.data);
        break;
      case 'finalizeRedemptions':
        await finalizeRedemptions(job.data);
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

schedulerQueue.add('finalizeDeposits', null, {
  repeat: {
    every: 1000 * 60, // every minute
  },
  jobId: 'finalizeDeposits',
});

schedulerQueue.add('finalizeRedemptions', null, {
  repeat: {
    every: 1000 * 60, // every minute
  },
  jobId: 'finalizeRedemptions',
});

schedulerWorker.on('completed', (job: Job, err: Error) => {
  logger.info(`${job.id} has been completed!`);
});

schedulerWorker.on('failed', (job: Job, err: Error) => {
  logger.error(`${job.id} has failed with ${err.message}`);
  Monitoring.captureException(err);
});

export async function start() {
  schedulerQueue.add('updateInvested', null, {
    jobId: 'updateInvested',
  });
  schedulerQueue.add('finalizeDeposits', null, {
    jobId: 'finalizeDeposits',
  });
  schedulerQueue.add('finalizeRedemptions', null, {
    jobId: 'finalizeRedemptions',
  });
  schedulerQueue.add(
    'vaultPerformance',
    { force: true },
    {
      jobId: 'vaultPerformance',
    },
  );
  schedulerQueue.add(
    'refreshOrganizations',
    { force: true },
    {
      jobId: 'refreshOrganizations',
    },
  );
}

export async function stop() {
  return await Promise.all([
    scheduler.close(),
    schedulerQueue.close(),
    schedulerWorker.close(),
  ]);
}
