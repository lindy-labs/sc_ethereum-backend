import { Job, Queue, QueueScheduler, Worker } from 'bullmq';

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
  await scheduledJobs();
  work();
}

async function scheduledJobs() {
  await myQueue.add(
    'job-name',
    { some: 'data' },
    {
      repeat: {
        cron: '* * * * * *',
      },
    },
  );
}

async function work() {
  new Worker(
    queueName,
    async (job: Job) => {
      console.log('job name', job.name);
      console.log('job data', job.data);
    },
    options,
  );
}
