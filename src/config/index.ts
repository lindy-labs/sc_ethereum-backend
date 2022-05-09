import assert from 'assert';

assert(process.env.GRAPH_URL);
assert(process.env.MNEMONIC);
assert(process.env.RPC_URL);
assert(process.env.STRATEGY);
assert(process.env.VAULT);

export default {
  graphURL: process.env.GRAPH_URL,
  mnemonic: process.env.MNEMONIC,
  rpcURL: process.env.RPC_URL,
  strategy: process.env.STRATEGY,
  vault: process.env.VAULT,
};
