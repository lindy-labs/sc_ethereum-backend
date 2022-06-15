import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class createSignatory1655284303800 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'signatory',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'address',
            type: 'varchar',
            length: '42',
          },
          {
            name: 'signature',
            type: 'varchar',
            length: '132',
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

    await queryRunner.createIndex(
      'signatory',
      new TableIndex({
        columnNames: ['address'],
        name: 'signatory_address',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('signatory', true, true, true);
  }
}
