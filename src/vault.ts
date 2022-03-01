import { Contract, providers } from 'ethers';
import addressesJson from '../config/addresses.json';
import vaultABI from '../abis/Vault.json';

export type Contracts = { [key: string]: Contract };

export const addresses: {
  [network: string]: { [contractType: string]: { [token: string]: string } };
} = addressesJson;

export let provider: providers.WebSocketProvider =
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

export async function getTotalShares(contracts: Contracts) {
  const calls = [];

  for (const [_vault, contract] of Object.entries(contracts)) {
    calls.push(contract.totalShares());
  }

  return await Promise.all(calls);
}

export async function getTotalUnderlyingMinusSponsored(contracts: Contracts) {
  const calls = [];

  for (const [_vault, contract] of Object.entries(contracts)) {
    calls.push(contract.totalUnderlyingMinusSponsored());
  }

  return await Promise.all(calls);
}
