import { client, v2 } from '@datadog/datadog-api-client';
import assert from 'assert';

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

export default new v2.MetricsApi(configuration);
