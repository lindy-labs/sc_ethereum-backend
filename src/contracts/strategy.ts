import { Contract } from 'ethers';
import { reduce } from 'lodash';
import { request, gql } from 'graphql-request';

import { Contracts, wallet } from '../helpers/provider';
// import { server } from '../api';
// import { contractCalls } from '../helpers/contracts';

import { addresses } from '../config/addresses';
import { abi as anchorUSTStratABI } from '../abis/AnchorUSTStrategy';

type DepositOperation = {
  id: string;
  idx: string;
  underlyingAmount: string;
  ustAmount: string;
};

type RedeemOperation = {
  id: string;
  idx: string;
  aUstAmount: string;
};

export const strategy: Contract = new Contract(
  addresses.ropsten.strategy.UST,
  anchorUSTStratABI,
  wallet,
);

export async function checkAndFinalizeDeposits() {
  const operations = await depositOperations();

  operations.forEach(async (operation: DepositOperation) => {
    strategy.finishDepositStable(operation.idx, {
      gasLimit: await strategy.finishDepositStable(operation.idx),
    });
  });
}

export async function checkAndFinalizeRedemptions() {
  const operations = await redeemOperations();

  operations.forEach(async (operation: RedeemOperation) => {
    strategy.finishRedeemStable(operation.idx, {
      gasLimit: await strategy.finishRedeemStable(operation.idx),
    });
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
        idx
        aUstAmount
      }
    }
  `;

  return (await request(process.env.GRAPH_URL!, query)).redeemOperations;
}
