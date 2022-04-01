import { Contract, providers, Wallet } from 'ethers';

export type Contracts = { [key: string]: Contract };

export const provider: providers.WebSocketProvider =
  new providers.WebSocketProvider(
    process.env.RPC_URL || 'http://127.0.0.1:8545',
  );

export const wallet: Wallet = Wallet.fromMnemonic(
  process.env.WALLET_MNEMONIC as string,
).connect(provider);
