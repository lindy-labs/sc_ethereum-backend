import { reduce } from 'lodash';
import { Contracts } from './provider';

export function contractCalls(
  contracts: Contracts,
  call: string,
  params: { [key: string]: any[] } = {},
): Promise<any>[] {
  return reduce(
    contracts,
    (memo: Promise<any>[], contract, key) => {
      memo.push(contract[call](...(params[key] || [])));
      return memo;
    },
    [],
  );
}
