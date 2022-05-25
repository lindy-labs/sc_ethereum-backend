import { BigNumber, Contract } from 'ethers';
import { request, gql } from 'graphql-request';

import config from '../config';
import { wallet } from '../providers';

import { abi as donationABI } from '../abis/Donation';

type Donation = {
  id: string;
  txHash: string;
  amount: string;
  owner: string;
  destination: string;
  minted: boolean;
  burned: boolean;
  nftId: string;
};

type BatchedDonations = { [key: string]: Donation[] };

const donationContract = new Contract(config.donation, donationABI, wallet);

export async function mintDonationNFT() {
  const graphDonations = await donations();

  const batchedDonations = batchDonations(graphDonations);

  for (const key in batchedDonations) {
    const donations = batchedDonations[key];

    const args = donations.map((donation: Donation) => {
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

    await donationContract.mint(key, 0, args);
  }
}

function batchDonations(donations: Donation[]): BatchedDonations {
  const batchedDonations: BatchedDonations = {};

  donations.forEach((donation: Donation) => {
    if (donation.minted) return;

    if (!batchedDonations[donation.txHash]) {
      batchedDonations[donation.txHash] = [donation];

      return;
    }
    
    batchedDonations[donation.txHash].push(donation);
  });

  return batchedDonations;
}

async function donations(): Promise<Donation[]> {
  const query = gql`
    {
      donations {
        id
        txHash
        amount
        owner
        destination
        minted
        burned
        nftId
      }
    }
  `;

  return (await request(config.graphURL, query)).donations;
}
