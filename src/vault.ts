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

function initializeVaults(): Contracts {
  const contracts: Contracts = {};

  for (const [vault, address] of Object.entries(addresses.ropsten.vault)) {
    contracts[vault] = new Contract(address, vaultABI, provider);
  }

  return contracts;
}

export const vaults = initializeVaults();

export function generateContractCalls(
  contracts: Contracts,
  call: string,
): Promise<any>[] {
  const calls = [];

  for (const [_vault, contract] of Object.entries(contracts)) {
    calls.push(contract[call]());
  }

  return calls;
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
