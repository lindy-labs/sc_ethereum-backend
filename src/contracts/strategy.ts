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

    if (await operationCanBeFinalized('finishDepositStable', operationIdx)) {
      await strategy.finishDepositStable(BigNumber.from(operation.idx), {
        gasLimit: await strategy.estimateGas.finishDepositStable(operationIdx),
      });

      break;
    }

    continue;
  }
}

export async function finalizeRedemptions() {
  const operations = await redeemOperations();

  for (const op of operations) {
    const operation: RedeemOperation = op;
    const operationIdx = BigNumber.from(operation.idx);

    if (await operationCanBeFinalized('finishRedeemStable', operationIdx)) {
      await strategy.finishRedeemStable(BigNumber.from(operation.idx), {
        gasLimit: await strategy.estimateGas.finishRedeemStable(operationIdx),
      });

      break;
    }

    continue;
  }
}

/**
 * Estimates operation finalization transaction without sending
 * to determine whether the operation is ready to be finalized.
 * If the transaction estimation throws an exception, the operation is not ready.
 * If the estimation succeeds then the operation is ready to be finalized.
 */
async function operationCanBeFinalized(
  functionName: string,
  operationIdx: BigNumber,
) {
  try {
    await strategy.estimateGas[functionName](operationIdx);

    return true;
  } catch (e) {
    return false;
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
