import { Contract } from 'ethers';
import { mapValues, reduce } from 'lodash';

import { addresses } from './config/addresses';
import { Contracts, wallet } from './provider';
import { abi as anchorUSTStratABI } from './abis/AnchorUSTStrategy';
import { abi as anchorNonUSTStratABI } from './abis/AnchorNonUSTStrategy';
import { server } from './server';

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

export function listenInitDepositRedeem() {
  mapValues(strategies, (strategy: Contract) => {
    strategy.on(
      'InitDepositStable',
      (
        operator: string,
        idx: number,
        underlyingAmount: number,
        ustAmount: number,
      ) => {
        // Begin tracking operator address
        server.log.info(
          `operator: ${operator} idx: ${idx} underlyingAmount: ${underlyingAmount} ustAmount: ${ustAmount}`,
        );
      },
    );

    strategy.on('InitRedeemStable', (operator: string, aUstAmount: number) => {
      // Begin tracking operator address
      server.log.info(`operator: ${operator} aUstAmount: ${aUstAmount}`);
    });
  });
}
