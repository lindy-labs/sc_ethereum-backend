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

export async function initSchedule() {
  await scheduleJobs();
  work();
}

async function scheduleJobs() {
  await myQueue.add('updateInvested', null, {
    repeat: {
      cron: '0 12 * * * *',
    },
  });
}

async function work() {
  new Worker(
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
}
