import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddVaultMetricToFoundationMetric1654100394617
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'foundation_metric',
      new TableColumn({
        name: 'vaultMetricId',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'foundation_metric',
      new TableForeignKey({
        columnNames: ['vaultMetricId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'vault_metric',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('foundation_metric');

    const foreignKey = table!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('vaultMetricId') !== -1,
    );

    await queryRunner.dropForeignKey('foundation_metric', foreignKey!);

    await queryRunner.dropColumn('foundation_metric', 'vaultMetricId');
  }
}
