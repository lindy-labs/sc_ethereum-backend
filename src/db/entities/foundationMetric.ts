import {
  Entity,
  JoinColumn,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import { VaultMetric } from './vaultMetric';
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

  @ManyToOne(() => VaultMetric)
  @JoinColumn()
  vaultMetric: VaultMetric;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;
}
