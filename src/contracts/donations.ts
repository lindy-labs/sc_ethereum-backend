import { Contract } from 'ethers';
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
};

async function instantiateDonation(address: string) {
  return new Contract(
    address,
    donationABI,
    wallet,
  );
}

export async function mintDonationNFT() {
  const graphDonations = await donations();

  graphDonations.forEach((donation: Donation) => {
    console.log('donation', donation);
  });
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
      }
    }
  `;

  return (await request(config.graphURL, query)).donations;
}
