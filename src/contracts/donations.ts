import { BigNumber, Contract, Wallet } from 'ethers';
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
  // const batchedDonations = batchDonations(
  //   stitchDonations(await donations(), await donationMints()),
  // );

  for (let i = 250; i > 0; i -= 1) {
    try {
      const batchedDonations = batchDonations(await mockStitchedDonations(i));

      for (const key in batchedDonations) {
        const donations = batchedDonations[key];

        console.log(`trying with ${donations.length} in one batch`);

        const args = donations.map((donation: Donation) => {
          return {
            destinationId:
              donation.destination == '0x' ? 0 : parseInt(donation.destination, 16),
            owner: donation.owner,
            token: config.underlying,
            amount: BigNumber.from(donation.amount),
            donationId: donation.id,
          };
        });

        await donationContract.mint(key, 0, args);
      }
    } catch (e) {
      if ((e as Error).message.includes('ran out of gas')) {
        console.log('ran out of gas');

        continue;
      }

      console.log('something else');

      break;
    }
  }
}

async function mockStitchedDonations(batchLimit: number): Promise<StitchedDonations> {
  const donations: StitchedDonations = {};

  for (let i = 0; i < batchLimit; i += 1) {
    const donationId = `some-donation-id-${i}`;
    donations[donationId] = {
      id: donationId,
      txHash: '0xb5c8bd9430b6cc87a0e2fe110ece6bf527fa4f170a4bc8cd032f768fc5219838',
      amount: BigNumber.from(1000).mul(BigNumber.from(10).pow(18)).toString(),
      owner: await Wallet.createRandom().getAddress(),
      destination: `${5}`,
      minted: false,
      burned: false,
      nftId: `${i}`,
    };
  }

  return donations;
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

  return (await request(config.graphURL.eth, query)).donations;
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

  return (await request(config.graphURL.polygon, query)).donationMints;
}
