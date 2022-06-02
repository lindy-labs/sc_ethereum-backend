import { ValueTransformer } from 'typeorm';

export class BigIntTransformer implements ValueTransformer {
  to(n: BigInt): string {
    return n.toString();
  }

  from(n: string) {
    return BigInt(n);
  }
}
