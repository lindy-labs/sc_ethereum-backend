import assert from 'assert';

assert(process.env.CHAIN_ID);
assert(process.env.ETH_GRAPH_URL);
assert(process.env.POLY_GRAPH_URL);
assert(process.env.MNEMONIC);
assert(process.env.ETH_RPC_URL);
assert(process.env.POLY_RPC_URL);
assert(process.env.STRATEGY);
assert(process.env.VAULT);
assert(process.env.DONATION);
assert(process.env.UNDERLYING);
assert(process.env.ENV);
assert.match(process.env.ENV, /^(local|staging|production)$/i);

export default {
  env: process.env.ENV,
  chainID: process.env.CHAIN_ID,
  graphURL: {
    eth: process.env.ETH_GRAPH_URL,
    polygon: process.env.POLY_GRAPH_URL,
  },
  mnemonic: process.env.MNEMONIC,
  rpcURL: {
    eth: process.env.ETH_RPC_URL,
    polygon: process.env.POLY_RPC_URL,
  },
  strategy: process.env.STRATEGY,
  vault: process.env.VAULT,
  donation: process.env.DONATION,
  underlying: process.env.UNDERLYING,
};
