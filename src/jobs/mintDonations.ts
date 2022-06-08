import { mintDonationNFT } from '../contracts/donations';
import { createJob } from './helpers';

const JOB_NAME = 'mintDonations';
const INTERVAL = 1;

export default createJob(JOB_NAME, INTERVAL, async function () {
  await mintDonationNFT();
});
