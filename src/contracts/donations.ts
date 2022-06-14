import { BigNumber, Contract } from 'ethers';
import { request, gql } from 'graphql-request';

import config from '../config';
import { polygonWallet } from '../providers';

import { abi as donationABI } from '../abis/Donation';
import { chunk, differenceBy, groupBy, keyBy, mapValues } from 'lodash';
import { Dictionary } from 'async';

type Donation = {
  id: string;
  txHash: string;
  amount: string;
  owner: string;
  destination: string;
};

const donationContract = new Contract(
  config.donation,
  donationABI,
  polygonWallet,
);

const BATCH_LIMIT = 240;

export async function mintDonationNFT() {
  const mintPromises = [];
  const batchedDonations = batchDonationsForMint(await getDonationsToMint());

  for (const key in batchedDonations) {
    const donations = batchedDonations[key];


    for (
      let batchNumber = 0;
      batchNumber < donations.length;
      batchNumber += 1
    ) {
      const donationBatch = donations[batchNumber];

      const args = donationBatch.map((donation: Donation) => {
        return {
          destinationId:
            donation.destination == '0x'
              ? 0
              : parseInt(donation.destination, 16),
          owner: donation.owner,
          token: config.underlying,
          amount: BigNumber.from(donation.amount),
          donationId: donation.id,
        };
      });

      mintPromises.push(donationContract.mint(key, batchNumber, args));
    }
  }

  await Promise.all(mintPromises);
}

function batchDonationsForMint(stitchedDonations: Dictionary<Donation>) {
  const donationsByTxHash = groupBy(stitchedDonations, 'txHash');

  return mapValues(donationsByTxHash, (donations) =>
    chunk(donations, BATCH_LIMIT),
  );
}

async function getDonationsToMint() {
  const { donations } = await request(
    config.graphURL.eth,
    gql`
      {
        donations {
          id
          txHash
          amount
          owner
          destination
        }
      }
    `,
  );

  const { donationMints } = await request(
    config.graphURL.polygon,
    gql`
      {
        donationMints {
          id
        }
      }
    `,
  );

  return keyBy(
    differenceBy(donations, donationMints, 'id') as unknown as Donation[],
    'id',
  );
}
