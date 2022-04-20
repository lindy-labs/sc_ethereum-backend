import assert from 'assert';

const mainnet = () => {
  assert(process.env.RPC_URL);
  assert(process.env.MNEMONIC);
  assert(process.env.VAULT);
  assert(process.env.STRATEGY);
  assert(process.env.GRAPH_URL);

  return {
    vault: process.env.VAULT,
    strategy: process.env.STRATEGY,
    rpcURL: process.env.RPC_URL,
    mnemonic: process.env.MNEMONIC,
    graphURL: process.env.GRAPH_URL,
  };
};

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
    vault: '0x07F269C684E0d1152C2C24eb798DD826a1021656',
    strategy: '0x1c8967Af415b1516c96c08880aA0E87e82161b9a',
    rpcURL: 'http://127.0.0.1:8545',
    mnemonic:
      'core tornado motion pigeon kiss dish differ asthma much ritual black foil',
    graphURL: 'http://127.0.0.1:8000/subgraphs/name/sandclock-eth',
  };
};

const config = () => {
  switch (process.env.ENV) {
    case 'testnet':
      return ropsten();
    case 'live':
      return mainnet();
    default:
      return local();
  }
};

export default config;
