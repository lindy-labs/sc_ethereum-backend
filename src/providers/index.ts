import { providers, Wallet } from 'ethers';
import configByNetwork from '../config';

const config = configByNetwork();

export const provider: providers.WebSocketProvider =
  new providers.WebSocketProvider(config.rpcURL || 'http://127.0.0.1:8545');

export const wallet: Wallet = Wallet.fromMnemonic(
  config.mnemonic as string,
).connect(provider);
