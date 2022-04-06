import assert from 'assert';

export default {
  ropsten: () => {
    assert(process.env.ROPSTEN_RPC_URL);
    assert(process.env.TESTNET_MNEMONIC);

    return {
      vault: '0x6e1d164c682698857EB22fB9a184B245329F7581',
      rpcURL: process.env.ROPSTEN_RPC_URL,
      mnemonic: process.env.TESTNET_MNEMONIC,
    };
  },
};
