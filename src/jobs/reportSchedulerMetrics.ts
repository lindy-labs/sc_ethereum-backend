import { reportMetrics } from '../metrics/scheduler';
import { createJob } from './helpers';

const JOB_NAME = 'reportSchedulerMetrics';
const INTERVAL = 1 / 120; // every 30 seconds

export default createJob(
  JOB_NAME,
  INTERVAL,
  async function (_ctx, queueName: string) {
    await reportMetrics(queueName);
  },
);
