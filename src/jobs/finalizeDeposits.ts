import { finalizeDeposits } from '../contracts/strategy';
import { createJob } from './helpers';

const JOB_NAME = 'finalizeDeposits';
const INTERVAL = 1 / 60;

export default createJob(JOB_NAME, INTERVAL, async function () {
  await finalizeDeposits();
});
