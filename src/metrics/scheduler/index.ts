import { client, v2 } from '@datadog/datadog-api-client';
import { Queue } from 'bullmq';
import _ from 'lodash';
import util from 'util';

const configuration = client.createConfiguration();
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
              timestamp: new Date().getTime() / 1000,
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

  console.log(
    util.inspect(request, { showHidden: false, depth: null, colors: true }),
  );

  // const data = apiInstance.submitMetrics(request);

  // console.log(
  //   'API called successfully. Returned data: ' + JSON.stringify(data),
  // );
};
