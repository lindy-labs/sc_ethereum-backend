import { Job, Queue, RedisConnection, Worker, WorkerOptions } from 'bullmq';

import reportQueueMetrics from '../jobs/reportQueueMetrics';

export class MetricsWorker extends Worker {
  constructor(
    queue: Queue,
    fn: (job: Job) => any,
    opts?: WorkerOptions,
    Connection?: typeof RedisConnection,
  ) {
    super(
      queue.name,
      async (job: Job) =>
        job.name === 'reportQueueMetrics'
          ? await reportQueueMetrics(job.data, queue)
          : await fn(job),
      opts,
      Connection,
    );

    queue.add(
      'reportQueueMetrics',
      { force: true },
      {
        repeat: {
          every: 1000 * 60 * 5, // every five minutes
        },
      },
    );
  }
}
