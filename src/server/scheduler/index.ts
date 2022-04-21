import { Job, Queue, QueueScheduler, Worker } from 'bullmq';

import * as Monitoring from '../../monitoring';
import logger from '../../logger';
import refreshOrganizations from '../../jobs/refreshOrganizations';
import options from '../../initializers/redis';

const SCHEDULER_QUEUE = 'ServerSchedulerQueue';

const scheduler = new QueueScheduler(SCHEDULER_QUEUE, options);
const schedulerQueue = new Queue(SCHEDULER_QUEUE, options);

const schedulerWorker = new Worker(
  SCHEDULER_QUEUE,
  async (job: Job) => {
    switch (job.name) {
      case 'refreshOrganizations':
        await refreshOrganizations(job.data);
        break;
    }
  },

  options,
);

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
