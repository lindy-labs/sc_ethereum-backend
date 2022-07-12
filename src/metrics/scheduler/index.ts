import { client, v2 } from '@datadog/datadog-api-client';
import assert from 'assert';
import { Queue } from 'bullmq';
import _ from 'lodash';

assert(process.env.DD_API_KEY);
assert(process.env.DD_APP_KEY);
assert(process.env.DD_SITE);

const configurationOpts = {
  authMethods: {
    apiKeyAuth: process.env.DD_API_KEY,
    appKeyAuth: process.env.DD_APP_KEY,
  },
};

const configuration = client.createConfiguration(configurationOpts);
client.setServerVariables(configuration, {
  site: process.env.DD_SITE,
});

const apiInstance = new v2.MetricsApi(configuration);

const createMetricsRequest = async (queueName: string) => {
  const queue = new Queue(queueName);

  const jobCounts = await queue.getJobCounts('wait', 'completed', 'failed');

  return {
    body: {
      series: _.map(jobCounts, (count: number, jobType: string) => {
        return {
          metric: `${queue.name}.jobs.${jobType}`,
          type: 3,
          points: [
            {
              timestamp: Math.ceil(new Date().getTime() / 1000),
              value: count,
            },
          ],
        };
      }),
    },
  } as v2.MetricsApiSubmitMetricsRequest;
};

export const reportMetrics = async (queueName: string) => {
  const request = await createMetricsRequest(queueName);
  await apiInstance.submitMetrics(request);
};
