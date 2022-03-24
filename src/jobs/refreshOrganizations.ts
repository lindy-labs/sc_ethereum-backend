import { refreshOrganizationsList } from '../organizations';
import { createJob } from './helpers';

const JOB_NAME = 'refreshOrganizations';
const INTERVAL = 4;

export default createJob(JOB_NAME, INTERVAL, async function () {
  await refreshOrganizationsList();
});
