import { finalizeRedemptions } from '../contracts/strategy';
import { createJob } from './helpers';

const JOB_NAME = 'finalizeRedemptions';
const INTERVAL = 1 / 60;

export default createJob(JOB_NAME, INTERVAL, async function () {
  await finalizeRedemptions();
});
