import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTimestampsToIncludeTimezone1652197186262
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `alter table vault_metric alter column "createdAt" type timestamptz using "createdAt"::timestamptz`,
    );
    await queryRunner.query(
      `alter table vault_metric alter column "updatedAt" type timestamptz using "updatedAt"::timestamptz`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `alter table vault_metric alter column "createdAt" type timestamp using "createdAt"::timestamp`,
    );
    await queryRunner.query(
      `alter table vault_metric alter column "updatedAt" type timestamp using "updatedAt"::timestamp`,
    );
  }
}
