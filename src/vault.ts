import { BigNumber, Contract, providers, Wallet } from 'ethers';

import configByNetwork from './config';
import { abi as vaultABI } from './abis/Vault';

const config = configByNetwork.ropsten();

const provider: providers.WebSocketProvider = new providers.WebSocketProvider(
  config.rpcURL || 'http://127.0.0.1:8545',
);

const wallet: Wallet = Wallet.fromMnemonic(config.mnemonic as string).connect(
  provider,
);

const vault = new Contract(config.vault, vaultABI, wallet);

// At first, 1 wei is 1x10^18 shares.
// That means that the value of a single share in wei is too low to represent without decimal places.
// Because of that, we measure the vault's performance as the value of 10^18 shares.
export async function vaultPerformance(): Promise<number> {
  const shares = await vault.totalShares();
  const underlying = await vault.totalUnderlyingMinusSponsored();

  return underlying.mul(BigNumber.from(10).pow(18)).div(shares);
}

export async function updateInvested() {
  return vault.updateInvested('0x', {
    gasLimit: await vault.estimateGas.updateInvested('0x'),
  });
}
