import _ from 'lodash';
import { BigNumber, Contract, providers } from 'ethers';
import addressesJson from '../config/addresses.json';
import vaultABI from '../abis/Vault.json';

export type Contracts = { [key: string]: Contract };

const addresses: {
  [network: string]: { [contractType: string]: { [token: string]: string } };
} = addressesJson;

export const provider: providers.WebSocketProvider =
  new providers.WebSocketProvider(
    process.env.RPC_URL || 'http://127.0.0.1:8545',
  );

export const vaults: Contracts = _.reduce(
  addresses.ropsten.vault,
  (memo: Contracts, address, vault) => {
    memo[vault] = new Contract(address, vaultABI, provider);
    return memo;
  },
  {},
);

export function generateContractCalls(
  contracts: Contracts,
  call: string,
): Promise<any>[] {
  return _.reduce(
    contracts,
    (memo: Promise<any>[], contract) => {
      memo.push(contract[call]);
      return memo;
    },
    [],
  );
}

export async function vaultPerformance(
  totalSharesCalls: Promise<BigNumber>[],
  totalUnderlyingMinusSponsoredCalls: Promise<BigNumber>[],
): Promise<BigNumber[]> {
  if (totalSharesCalls.length !== totalUnderlyingMinusSponsoredCalls.length) {
    throw 'mismatch between totalSharesCalls and totalUnderlyingMinusSponsoredCalls';
  }

  const response = await Promise.allSettled([
    ...totalSharesCalls,
    ...totalUnderlyingMinusSponsoredCalls,
  ]).then((values) => {
    return values.map((values) => {
      // When rejected, fall back to BigNumber 0.
      if (values.status === 'rejected') {
        return BigNumber.from('0');
      }

      return values.value;
    });
  });

  const vaultTotalShares = response.slice(0, totalSharesCalls.length);
  const vaultTotalUnderlyingMinusSponsored = response.slice(
    -totalSharesCalls.length,
  );

  return vaultTotalShares.map((totalShare: BigNumber, i: number) => {
    return totalShare.div(vaultTotalUnderlyingMinusSponsored[i]);
  });
}
