import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateFoundationMetric1654002668273 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'foundation_metric',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'foundation',
            type: 'varchar',
          },
          {
            name: 'shares',
            type: 'varchar',
          },
          {
            name: 'amountDeposited',
            type: 'varchar',
          },
          {
            name: 'amountClaimed',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('foundation_metric', true, true, true);
  }
}
