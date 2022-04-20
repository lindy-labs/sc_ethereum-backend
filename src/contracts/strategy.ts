import { BigNumber, Contract } from 'ethers';
import { request, gql } from 'graphql-request';

import { wallet } from '../providers';

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

  for (const op of operations) {
    const operation: DepositOperation = op;
    const operationIdx = BigNumber.from(operation.idx);

    try {
      await strategy.estimateGas.finishDepositStable(operationIdx);
    } catch (e) {
      server.log.error((e as Error).message);

      continue;
    }

    await strategy.finishDepositStable(BigNumber.from(operation.idx), {
      gasLimit: await strategy.estimateGas.finishDepositStable(operationIdx),
    });

    break;
  }
}

export async function finalizeRedemptions() {
  const operations = await redeemOperations();

  for (const op of operations) {
    const operation: RedeemOperation = op;
    const operationIdx = BigNumber.from(operation.idx);

    try {
      await strategy.estimateGas.finishRedeemStable(operationIdx);
    } catch (e) {
      server.log.error((e as Error).message);

      continue;
    }

    await strategy.finishRedeemStable(BigNumber.from(operation.idx), {
      gasLimit: await strategy.estimateGas.finishRedeemStable(operationIdx),
    });

    break;
  }
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
