import { ValueTransformer } from 'typeorm';

export class DecimalTransformer implements ValueTransformer {
  /**
   * Used to marshal Decimal when writing to the database.
   */
  to(decimal: number): string {
    return decimal.toString();
  }
  /**
   * Used to unmarshal Decimal when reading from the database.
   */
  from(decimal: string) {
    return parseFloat(decimal);
  }
}
