import { Contract } from 'ethers';
import addressesJson from '../config/addresses.json';
import vaultABI from '../abis/Vault.json';

const addresses: { [key: string]: any } = addressesJson;

type Contracts = { [key: string]: Contract };

function initializeVaults(): Contracts {
  const contracts: Contracts = {};

  Object.keys(addresses.ropsten.vault).forEach((token: string) => {
    contracts[token] = new Contract(addresses.ropsten.vault[token], vaultABI);
  });

  return contracts;
}

export const vaults = initializeVaults();

export function getTotalShares() {}
