import { updateInvested } from '../vault';
import { createJob } from './helpers';

const JOB_NAME = 'updateInvested';
const INTERVAL = 24;

export default createJob(JOB_NAME, INTERVAL, async function () {
  await updateInvested();
});
