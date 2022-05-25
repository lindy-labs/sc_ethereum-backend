import { BigNumber, Contract, providers, Wallet } from 'ethers';
import { Decimal } from 'decimal.js';

import config from '../config';
import { wallet } from '../providers';

import { abi as vaultABI } from '../abis/Vault';

const vault = new Contract(config.vault, vaultABI, wallet);

// At first, 1 wei is 1x10^18 shares.
// That means that the value of a single share in wei is too low to represent without decimal places.
// Because of that, we measure the vault's performance as the value of 10^18 shares.
export async function vaultPerformance() {
  const shares = (await vault.totalShares()) as BigNumber;
  const underlying = (await vault.totalUnderlyingMinusSponsored()) as BigNumber;

  return new Decimal(underlying.mul(BigNumber.from(10).pow(18)).toString())
    .dividedBy(shares.toString())
    .toFixed();
}

export async function updateInvested() {
  return vault.updateInvested({
    gasLimit: await vault.estimateGas.updateInvested(),
  });
}
