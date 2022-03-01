import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateVaultMetric1646127696806 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "vault_metric",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
          },
          {
            name: "key",
            type: "varchar",
          },
          {
            name: "value",
            type: "varchar",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
          },
        ],
      })
    );

    await queryRunner.createIndex(
      "vault_metric",
      new TableIndex({
        name: "vault_metric_timestamp",
        columnNames: ["updatedAt"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("vault_metric", true, true, true);
  }
}
