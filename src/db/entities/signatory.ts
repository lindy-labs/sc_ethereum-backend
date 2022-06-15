import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Signatory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  signature: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}