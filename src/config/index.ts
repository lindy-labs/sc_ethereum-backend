import assert from 'assert';

assert(process.env.CHAIN_ID);
assert(process.env.GRAPH_URL);
assert(process.env.MNEMONIC);
assert(process.env.RPC_URL);
assert(process.env.STRATEGY);
assert(process.env.VAULT);
assert(process.env.DONATION);
assert(process.env.UNDERLYING);

export default {
  chainID: process.env.CHAIN_ID,
  graphURL: process.env.GRAPH_URL,
  mnemonic: process.env.MNEMONIC,
  rpcURL: process.env.RPC_URL,
  strategy: process.env.STRATEGY,
  vault: process.env.VAULT,
  donation: process.env.DONATION,
  underlying: process.env.UNDERLYING,
};
