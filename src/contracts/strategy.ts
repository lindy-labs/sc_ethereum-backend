import { BigNumber, Contract } from 'ethers';
import { request, gql } from 'graphql-request';

import { wallet } from '../providers';

import configByNetwork from '../config';
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

type Operation = DepositOperation | RedeemOperation;

const config = configByNetwork();

export const strategy: Contract = new Contract(
  config.strategy,
  anchorUSTStratABI,
  wallet,
);

export async function finalizeDeposits() {
  const operations = await depositOperations();

  await finalizeOperations(operations, 'finishDepositStable');
}

export async function finalizeRedemptions() {
  const operations = await redeemOperations();

  await finalizeOperations(operations, 'finishRedeemStable');
}

async function finalizeOperations(
  operations: Array<Operation>,
  functionName: string,
) {
  for (const op of operations) {
    const operation: Operation = op;
    const operationIdx = BigNumber.from(operation.idx);

    // If the operation can be finalized, finalize it and break the loop.
    // Only one operation can be finalized by ethAnchor at a time, so we
    // cannot finalize multiple operations in a loop.
    if (await operationCanBeFinalized(functionName, operationIdx)) {
      await strategy[functionName](BigNumber.from(operation.idx), {
        gasLimit: await strategy.estimateGas[functionName](operationIdx),
      });

      break;
    }

    // If the operation cannot be finalized, try the next operation.
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
