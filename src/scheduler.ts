import { Job, Queue, QueueScheduler, Worker } from 'bullmq';
import { QUEUE_NAME } from './config/constants';
import { server } from './server';
import { updateInvested } from './vault';

const options = {
  connection: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
};

new QueueScheduler(QUEUE_NAME, options);
const queue = new Queue(QUEUE_NAME, options);

export function initSchedule() {
  initWorker();
  scheduleJobs();
}

function scheduleJobs() {
  queue.add('updateInvested', null, {
    repeat: {
      cron: '0 0 12 * * *',
    },
  });
}

function initWorker() {
  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job) => {
      switch (job.name) {
        case 'updateInvested':
          updateInvested();
          break;
      }
    },
    options,
  );

  worker.on('completed', (job: Job, err: Error) => {
    server.log.debug(`${job.id} has been completed!`);
  });

  worker.on('failed', (job: Job, err: Error) => {
    server.log.error(`${job.id} has failed with ${err.message}`);
  });
}
