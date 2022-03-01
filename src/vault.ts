import { Contract } from 'ethers';
import addressesJson from '../config/addresses.json';
import vaultABI from '../abis/Vault.json';

export type Contracts = { [key: string]: Contract };

export const addresses: {
  [key: string]: { [key: string]: { [key: string]: string } };
} = addressesJson;

function initializeVaults(): Contracts {
  const contracts: Contracts = {};

  Object.keys(addresses.ropsten.vault).forEach((token: string) => {
    contracts[token] = new Contract(addresses.ropsten.vault[token], vaultABI);
  });

  return contracts;
}

export const vaults = initializeVaults();

export function getTotalShares() {}
