import { BigNumber, Contract } from 'ethers';
import { request, gql } from 'graphql-request';

import config from '../config';
import { polygonWallet } from '../providers';

import { abi as donationABI } from '../abis/Donation';
import { chunk, filter, groupBy, keyBy, mapValues } from 'lodash';
import { Dictionary } from 'async';

type Donation = {
  id: string;
  txHash: string;
  amount: string;
  owner: string;
  destination: string;
};

type MintedDonation = {
  id: string;
  burned: boolean;
  nftId: string;
};

interface StitchedDonation extends Donation, MintedDonation {
  minted: boolean;
}

const donationContract = new Contract(
  config.donation,
  donationABI,
  polygonWallet,
);

const BATCH_LIMIT = 240;

export async function mintDonationNFT() {
  const batchedDonations = batchDonations(
    stitchDonations(await getDonations(), await getMintedDonations()),
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

      donationContract.mint(key, batchNumber, args);
    }
  }
}

function stitchDonations(
  donations: Donation[],
  mintedDonations: MintedDonation[],
) {
  const donationsById = keyBy(donations, 'id');

  return mintedDonations.reduce((memo, mintedDonation: MintedDonation) => {
    memo[mintedDonation.id] = {
      ...memo[mintedDonation.id],
      ...mintedDonation,
      minted: true,
    } as StitchedDonation;

    return memo;
  }, donationsById) as Dictionary<StitchedDonation>;
}

function batchDonations(stitchedDonations: Dictionary<StitchedDonation>) {
  const donationsToMint: StitchedDonation[] = filter(
    stitchedDonations,
    (donation) => !donation.minted,
  );

  const donationsByTxHash = groupBy(donationsToMint, 'txHash');

  return mapValues(donationsByTxHash, (donations) =>
    chunk(donations, BATCH_LIMIT),
  );
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

async function getMintedDonations(): Promise<MintedDonation[]> {
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
