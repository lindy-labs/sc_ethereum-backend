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
  minted: boolean;
  burned: boolean;
  nftId: string;
};

const donationContract = new Contract(config.donation, donationABI, wallet);

export async function mintDonationNFT() {
  const graphDonations = await donations();

  let nftIndex = highestNFTId(graphDonations);

  for (const donation of graphDonations) {
    if (!donation.minted) {
      nftIndex += 1;

      console.log(await donationContract.mint(donation.txHash, nftIndex, [
        {
          destinationId: parseInt(donation.destination, 16),
          owner: donation.owner,
          token: config.underlying,
          amount: donation.amount,
          donationId: donation.id,
        },
      ]));
    }
  }
}

function highestNFTId(graphDonations: Donation[]): number {
  let nftId = 0;

  for (const donation of graphDonations) {
    const id = parseInt(donation.nftId);
    if (id > nftId) nftId = id;
  }

  return nftId;
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
