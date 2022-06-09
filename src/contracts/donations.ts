import { BigNumber, Contract } from 'ethers';
import { request, gql } from 'graphql-request';

import config from '../config';
import { polygonWallet } from '../providers';

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

type BatchedDonations = { [key: string]: StitchedDonation[][] };

type StitchedDonations = { [key: string]: StitchedDonation };

const donationContract = new Contract(
  config.donation,
  donationABI,
  polygonWallet,
);

export async function mintDonationNFT() {
  const batchedDonations = batchDonations(
    stitchDonations(await getDonations(), await getDonationMints()),
  );

  for (const key in batchedDonations) {
    const donations = batchedDonations[key];

    for (
      let batchNumber = 0;
      batchNumber < donations.length;
      batchNumber += 1
    ) {
      const donationBatch = donations[batchNumber];

      const args = donationBatch.map((donation: StitchedDonation) => {
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

      await donationContract.mint(key, batchNumber, args);
    }
  }
}

function stitchDonations(
  donations: Donation[],
  donationMints: DonationMint[],
): StitchedDonations {
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

  let batchNumbers: { [txHash: string]: number } = {};
  for (const key in donations) {
    const donation = donations[key];

    // Keep track of batchNumber for each set of donations in a transaction.
    if (!batchNumbers[donation.txHash]) {
      batchNumbers[donation.txHash] = 0;
    }

    // Skip already minted donations.
    if (donation.minted) continue;

    // Initialize 2D array if this transaction key has no previous donation batch.
    if (!batchedDonations[donation.txHash]) {
      batchedDonations[donation.txHash] = [[donation]];

      continue;
    }

    // Increment the batchNumber for specified txHash if batchLimit has been reached.
    // This is done to prevent hitting transaction gas limit.
    if (
      batchedDonations[donation.txHash][batchNumbers[donation.txHash]].length >=
      240
    ) {
      batchNumbers[donation.txHash] += 1;
    }

    // Push the donation into its corresponding donation batch.
    batchedDonations[donation.txHash][batchNumbers[donation.txHash]].push(
      donation,
    );
  }

  return batchedDonations;
}

async function getDonations(): Promise<Donation[]> {
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

  return (await request(config.graphURL.eth, query)).donations;
}

async function getDonationMints(): Promise<DonationMint[]> {
  const query = gql`
    {
      donationMints {
        id
        burned
        nftId
      }
    }
  `;

  return (await request(config.graphURL.polygon, query)).donationMints;
}
