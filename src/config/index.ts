import assert from 'assert';

export default {
  ropsten: () => {
    assert(process.env.ROPSTEN_RPC_URL);
    assert(process.env.TESTNET_MNEMONIC);
    assert(process.env.ROPSTEN_VAULT);

    return {
      vault: process.env.ROPSTEN_VAULT,
      rpcURL: process.env.ROPSTEN_RPC_URL,
      mnemonic: process.env.TESTNET_MNEMONIC,
    };
  },
};
