import { providers, Wallet } from 'ethers';
import config from '../config';

export const provider: providers.JsonRpcProvider =
  new providers.JsonRpcProvider(config.rpcURL.eth || 'http://127.0.0.1:8545');

export const polygonProvider: providers.JsonRpcProvider =
  new providers.JsonRpcProvider(
    config.rpcURL.polygon || 'http://127.0.0.1:8545',
  );

export const wallet: Wallet = Wallet.fromMnemonic(
  config.mnemonic as string,
).connect(provider);

export const polygonWallet: Wallet = Wallet.fromMnemonic(
  config.mnemonic as string,
).connect(polygonProvider);
