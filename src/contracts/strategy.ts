import { Contract } from 'ethers';
import { reduce } from 'lodash';
import { request, gql } from 'graphql-request';

import { Contracts, wallet } from '../helpers/provider';
// import { server } from '../api';
// import { contractCalls } from '../helpers/contracts';

import { addresses } from '../config/addresses';
import { abi as anchorUSTStratABI } from '../abis/AnchorUSTStrategy';
import { abi as anchorNonUSTStratABI } from '../abis/AnchorNonUSTStrategy';

type DepositOperation = {
  finished: boolean;
  id: string;
  idx: string;
  underlyingAmount: string;
  ustAmount: string;
};

type RedeemOperation = {
  finished: boolean;
  id: string;
  aUstAmount: string;
};

export const strategies: Contracts = reduce(
  addresses.ropsten.strategy,
  (memo: Contracts, address: string, strategy: string) => {
    let contract = new Contract(address, anchorNonUSTStratABI, wallet);
    if (strategy === 'UST') {
      contract = new Contract(address, anchorUSTStratABI, wallet);
    }
    memo[strategy] = contract;
    return memo;
  },
  {},
);

export async function checkAndFinalizeDeposits() {
  const operations = await depositOperations();

  const unfinished = operations.forEach((operation: DepositOperation) => {
    if (!operation.finished) {
      // Attempt to finalize deposit
    }
  });
}

export async function checkAndFinalizeRedemptions() {
  const operations = await redeemOperations();

  const unfinished = operations.forEach((operation: RedeemOperation) => {
    if (!operation.finished) {
      // Attempt to finalize redemption
    }
  });
}

export async function depositOperations(): Promise<DepositOperation[]> {
  const query = gql`
    {
      depositOperations {
        id
        idx
        underlyingAmount
        ustAmount
        finished
      }
    }
  `;

  return (await request(process.env.GRAPH_URL!, query)).depositOperations;
}

export async function redeemOperations(): Promise<RedeemOperation[]> {
  const query = gql`
    {
      redeemOperations {
        id
        aUstAmount
        finished
      }
    }
  `;

  return (await request(process.env.GRAPH_URL!, query)).redeemOperations;
}
