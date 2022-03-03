import { Job, Queue, QueueScheduler, Worker } from 'bullmq';
import { updateInvested } from './vault';

const queueName = 'Queue';

const options = {
  connection: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
};

new QueueScheduler(queueName, options);
const myQueue = new Queue(queueName, options);

export function initSchedule() {
  scheduleJobs();
  work();
}

function scheduleJobs() {
  myQueue.add('updateInvested', null, {
    repeat: {
      cron: '0 12 * * * *',
    },
  });
}

function work() {
  const worker = new Worker(
    queueName,
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
    console.log(`${job.id} has been completed!`);
  });

  worker.on('failed', (job: Job, err: Error) => {
    console.error(`${job.id} has failed with ${err.message}`);
  });
}
