import { reduce, drop, dropRight, mapValues } from 'lodash';
import { BigNumber, Contract } from 'ethers';
import assert from 'assert/strict';

import { Contracts, wallet } from '../helpers/provider';
import { contractCalls } from '../helpers/contracts';

import { addresses } from '../config/addresses';
import { abi as vaultABI } from '../abis/Vault';

assert(process.env.WALLET_MNEMONIC);

export const vaults: Contracts = reduce(
  addresses.ropsten.vault,
  (memo: Contracts, address: string, vault: string) => {
    memo[vault] = new Contract(address, vaultABI, wallet);
    return memo;
  },
  {},
);

export async function vaultPerformances(): Promise<BigNumber[]> {
  const response = await Promise.allSettled([
    ...contractCalls(vaults, 'totalShares'),
    ...contractCalls(vaults, 'totalUnderlyingMinusSponsored'),
  ]);

  const metrics = response.map((values) => {
    // When rejected, fall back to BigNumber 0.
    if (values.status === 'rejected') {
      return BigNumber.from('0');
    }

    return values.value;
  });

  const shares = dropRight(metrics, metrics.length / 2);
  const underlying = drop(metrics, metrics.length / 2);

  return shares.map((totalShare: BigNumber, i: number) => {
    try {
      return totalShare.div(underlying[i]);
    } catch (_e) {
      return BigNumber.from('0');
    }
  });
}

export async function updateInvested() {
  mapValues(vaults, (vault) => vault.updateInvested('0x'));
}
