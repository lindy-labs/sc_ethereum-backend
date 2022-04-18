import { BigNumber, Contract } from 'ethers';
import { request, gql } from 'graphql-request';

import { wallet } from '../helpers/provider';

import configByNetwork from '../config';
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

const config = configByNetwork();

export const strategy: Contract = new Contract(
  config.strategy,
  anchorUSTStratABI,
  wallet,
);

export async function finalizeDeposits() {
  const operations = await depositOperations();

  operations.forEach(async (operation: DepositOperation) => {
    try {
      const gasLimit = await strategy.estimateGas.finishDepositStable(
        BigNumber.from(operation.idx),
      );

      await strategy.finishDepositStable(BigNumber.from(operation.idx), {
        gasLimit,
      });
    } catch (e) {
      server.log.error((e as Error).message);
    }
  });
}

export async function finalizeRedemptions() {
  const operations = await redeemOperations();

  operations.forEach(async (operation: RedeemOperation) => {
    const gasLimit = await strategy.estimateGas.finishRedeemStable(
      BigNumber.from(operation.idx),
    );

    try {
      await strategy.finishRedeemStable(BigNumber.from(operation.idx), {
        gasLimit,
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

  return (await request(config.graphURL, query)).depositOperations;
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

  return (await request(config.graphURL, query)).redeemOperations;
}
