import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { DecimalTransformer } from '../decimal.transform';

@Entity()
export class VaultMetric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column({ type: 'decimal', transformer: new DecimalTransformer() })
  value: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;
}
