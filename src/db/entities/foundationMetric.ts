import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { BigIntTransformer } from '../bigint.transformer';

@Entity()
export class FoundationMetric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  foundation: string;

  @Column({ transformer: new BigIntTransformer() })
  amountDeposited: string;

  @Column({ transformer: new BigIntTransformer() })
  amountClaimed: string;

  @Column({ transformer: new BigIntTransformer() })
  shares: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;
}
