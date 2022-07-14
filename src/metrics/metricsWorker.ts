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
      async (job: Job) => {
        return job.name === 'reportQueueMetrics'
          ? await reportQueueMetrics(job.data, queue.name)
          : await fn(job);
      },
      opts,
      Connection,
    );

    queue.add(
      'reportQueueMetrics',
      { force: true },
      {
        repeat: {
          every: 1000 * 30, // every half-minute
        },
      },
    );
  }
}
