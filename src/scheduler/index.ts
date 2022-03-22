import { Job, Queue, QueueScheduler, Worker } from 'bullmq';

import logger from '../logger';
import { collectVaultPerformances } from '../services/vaultMetric';
import { updateInvested } from '../vault';

const SCHEDULER_QUEUE = 'SchedulerQueue';

const options = {
  connection: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
};

let scheduler: QueueScheduler;
let schedulerQueue: Queue;
let schedulerWorker: Worker;

scheduler = new QueueScheduler(SCHEDULER_QUEUE, options);
schedulerQueue = new Queue(SCHEDULER_QUEUE, options);

export function start() {
  startWorker();
  scheduleWork();
}

export async function stop() {
  return await Promise.all([
    scheduler.close(),
    schedulerQueue.close(),
    schedulerWorker.close(),
  ]);
}

function scheduleWork() {
  schedulerQueue.add('updateInvested', null, {
    repeat: {
      cron: '0 0 12 * * *', // noon
    },
  });

  schedulerQueue.add('vaultPerformance', null, {
    repeat: {
      cron: '0 0 0 * * *', // midnight
    },
  });
}

function startWorker() {
  schedulerWorker = new Worker(
    SCHEDULER_QUEUE,
    async (job: Job) => {
      switch (job.name) {
        case 'updateInvested':
          await updateInvested();
          break;
        case 'vaultPerformance':
          await collectVaultPerformances();
          break;
      }
    },
    options,
  );

  schedulerWorker.on('completed', (job: Job, err: Error) => {
    logger.info(`${job.id} has been completed!`);
  });

  schedulerWorker.on('failed', (job: Job, err: Error) => {
    logger.error(`${job.id} has failed with ${err.message}`);
  });
}
