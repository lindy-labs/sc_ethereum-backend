import assert from 'assert';

const ropsten = () => {
  assert(process.env.ROPSTEN_RPC_URL);
  assert(process.env.TESTNET_MNEMONIC);
  assert(process.env.ROPSTEN_VAULT);
  assert(process.env.ROPSTEN_STRATEGY);
  assert(process.env.ROPSTEN_GRAPH_URL);

  return {
    vault: process.env.ROPSTEN_VAULT,
    strategy: process.env.ROPSTEN_STRATEGY,
    rpcURL: process.env.ROPSTEN_RPC_URL,
    mnemonic: process.env.TESTNET_MNEMONIC,
    graphURL: process.env.ROPSTEN_GRAPH_URL,
  };
};

const local = () => {
  assert(process.env.LOCAL_VAULT);
  assert(process.env.LOCAL_STRATEGY);

  return {
    vault: process.env.LOCAL_VAULT,
    strategy: process.env.LOCAL_STRATEGY,
    rpcURL: 'http://127.0.0.1:8545',
    mnemonic:
      'core tornado motion pigeon kiss dish differ asthma much ritual black foil',
    graphURL: 'http://127.0.0.1:8000/subgraphs/name/sandclock-eth',
  };
};

export default {
  env: () => (process.env.ENV === 'local' ? local() : ropsten()),
  ropsten,
  local,
};
