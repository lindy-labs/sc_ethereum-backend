import { Job, Queue, RedisConnection, Worker, WorkerOptions } from 'bullmq';

import reportSchedulerMetrics from '../../jobs/reportSchedulerMetrics';

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
        return job.name === 'reportSchedulerMetrics'
          ? await reportSchedulerMetrics(job.data, queue.name)
          : await fn(job);
      },
      opts,
      Connection,
    );

    queue.add('reportSchedulerMetrics', null, {
      repeat: {
        every: 1000 * 30, // every half-minute
      },
    });
  }
}
