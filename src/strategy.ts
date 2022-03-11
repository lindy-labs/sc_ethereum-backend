import { Contract } from 'ethers';
import { reduce } from 'lodash';

import { addresses } from './config/addresses';
import { Contracts, wallet } from './provider';
import { abi as anchorUSTStratABI } from './abis/AnchorUSTStrategy';
import { abi as anchorNonUSTStratABI } from './abis/AnchorNonUSTStrategy';

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
