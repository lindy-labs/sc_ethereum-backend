import { Contract } from 'ethers';
import { reduce } from 'lodash';
import { request, gql } from 'graphql-request';

import { Contracts, wallet } from '../helpers/provider';
// import { server } from '../api';
// import { contractCalls } from '../helpers/contracts';

import { addresses } from '../config/addresses';
import { abi as anchorUSTStratABI } from '../abis/AnchorUSTStrategy';
import { abi as anchorNonUSTStratABI } from '../abis/AnchorNonUSTStrategy';

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

export async function depositOperations() {
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

  const response = await request(process.env.GRAPH_URL!, query);

  console.log('depositOperations query response', response);
}

export async function redeemOperations() {
  const query = gql`
    {
      redeemOperations {
        id
        aUstAmount
        finished
      }
    }
  `;

  const response = await request(process.env.GRAPH_URL!, query);

  console.log('redeemOperations query response', response);
}
