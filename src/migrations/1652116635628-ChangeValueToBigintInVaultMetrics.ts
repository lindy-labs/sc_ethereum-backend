import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeValueToBigintInVaultMetrics1652116635628
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `alter table vault_metric alter column value type decimal using value::decimal`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `alter table vault_metric alter column value type varchar using value::varchar`,
    );
  }
}
