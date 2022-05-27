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
};

type DonationMint = {
  id: string;
  burned: boolean;
  nftId: string;
};

type StitchedDonation = {
  id: string;
  txHash: string;
  amount: string;
  owner: string;
  destination: string;
  minted: boolean;
  burned: boolean;
  nftId: string;
};

type BatchedDonations = { [key: string]: StitchedDonation[] };

type StitchedDonations = { [key: string]: StitchedDonation };

const donationContract = new Contract(config.donation, donationABI, wallet);

export async function mintDonationNFT() {
  const batchedDonations = batchDonations(stitchDonations(await donations(), await donationMints()));

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

function stitchDonations(donations: Donation[], donationMints: DonationMint[]): StitchedDonations {
  const donationsMap: StitchedDonations = {};

  donations.forEach((donation: Donation) => {
    donationsMap[donation.id] = donation as StitchedDonation;
  });

  donationMints.forEach((donationMint: DonationMint) => {
    donationsMap[donationMint.id] = {
      ...donationsMap[donationMint.id],
      minted: true,
      ...donationMint,
    };
  });

  return donationsMap;
}

function batchDonations(donations: StitchedDonations): BatchedDonations {
  const batchedDonations: BatchedDonations = {};

  for (const key in donations) {
    const donation = donations[key];

    if (donation.minted) continue;

    if (!batchedDonations[donation.txHash]) {
      batchedDonations[donation.txHash] = [donation];

      continue;
    }
    
    batchedDonations[donation.txHash].push(donation);
  }

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
      }
    }
  `;

  return (await request(config.graphURL, query)).donations;
}

async function donationMints(): Promise<DonationMint[]> {
  const query = gql`
    {
      donationMints {
        id
        burned
        nftId
      }
    }
  `;

  return (await request(config.graphURL, query)).donationMints;
}
