import { BigNumber, Contract } from 'ethers';
import { request, gql } from 'graphql-request';

import { wallet } from '../helpers/provider';

import { addresses } from '../config/addresses';
import { abi as anchorUSTStratABI } from '../abis/AnchorUSTStrategy';
import { server } from '../api';

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

export async function finalizeDeposits() {
  const operations = await depositOperations();

  operations.forEach(async (operation: DepositOperation) => {
    try {
      await strategy.finishDepositStable(BigNumber.from(operation.idx), {
        gasLimit: await strategy.estimateGas.finishDepositStable(
          BigNumber.from(operation.idx),
        ),
      });
    } catch (e) {
      server.log.error((e as Error).message);
    }
  });
}

export async function finalizeRedemptions() {
  const operations = await redeemOperations();

  operations.forEach(async (operation: RedeemOperation) => {
    try {
      await strategy.finishRedeemStable(BigNumber.from(operation.idx), {
        gasLimit: await strategy.estimateGas.finishRedeemStable(
          BigNumber.from(operation.idx),
        ),
      });
    } catch (e) {
      server.log.error((e as Error).message);
    }
  });
}

async function depositOperations(): Promise<DepositOperation[]> {
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

async function redeemOperations(): Promise<RedeemOperation[]> {
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
