import { createJob } from './helpers';
import { Queue } from 'bullmq';
import _ from 'lodash';
import { v2 } from '@datadog/datadog-api-client';

import apiInstance from '../initializers/datadogApiClient';
import config from '../config';

const JOB_NAME = 'reportQueueMetrics';
const INTERVAL = 1 / 12; // every 5 minutes 

export default createJob(
  JOB_NAME,
  INTERVAL,
  async function (_ctx, queueName: string) {
    const queue = new Queue(queueName);

    const jobCounts = await queue.getJobCounts('wait', 'completed', 'failed');

    const request = {
      body: {
        series: _.map(jobCounts, (count: number, jobType: string) => {
          return {
            metric: `${queueName}.jobs.${jobType}`,
            type: 3,
            points: [
              {
                timestamp: Math.ceil(new Date().getTime() / 1000),
                value: count,
              },
            ],
            tags: [
              config.env,
            ],
          };
        }),
      },
    } as v2.MetricsApiSubmitMetricsRequest;

    await apiInstance.submitMetrics(request);
  },
);
