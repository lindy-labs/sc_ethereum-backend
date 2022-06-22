import { providers, Wallet } from 'ethers';
import config from '../config';

export const provider: providers.WebSocketProvider =
  new providers.WebSocketProvider(config.rpcURL.eth || 'wss://127.0.0.1:8545');

export const polygonProvider: providers.WebSocketProvider =
  new providers.WebSocketProvider(
    config.rpcURL.polygon || 'wss://127.0.0.1:8545',
  );

export const wallet: Wallet = Wallet.fromMnemonic(
  config.mnemonic as string,
).connect(provider);

export const polygonWallet: Wallet = Wallet.fromMnemonic(
  config.mnemonic as string,
).connect(polygonProvider);
