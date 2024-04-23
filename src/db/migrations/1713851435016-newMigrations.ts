import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1713851435016 implements MigrationInterface {
  name = 'NewMigrations1713851435016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public2"."sme_health_check_images" ("id" SERIAL NOT NULL, "sme_health_check_id" integer NOT NULL, "file" character varying NOT NULL, CONSTRAINT "PK_56074c2ee4fd0c613c7b918c257" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "public2"."sme_health_check" ("id" SERIAL NOT NULL, "company_uen" character varying NOT NULL, "company_name" character varying NOT NULL, "full_name" character varying NOT NULL, "company_position" character varying NOT NULL, "email" character varying NOT NULL, "mobile_no" character varying NOT NULL, CONSTRAINT "UQ_09c012f2a34c53110dbb2e5b6dc" UNIQUE ("email"), CONSTRAINT "PK_1c231a17f18fa2417df02e6f0a1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "public2"."sme_health_check_images" ADD CONSTRAINT "FK_b77c627120fc4f12beabd398932" FOREIGN KEY ("sme_health_check_id") REFERENCES "public2"."sme_health_check"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public2"."sme_health_check_images" DROP CONSTRAINT "FK_b77c627120fc4f12beabd398932"`,
    );
    await queryRunner.query(`DROP TABLE "public2"."sme_health_check"`);
    await queryRunner.query(`DROP TABLE "public2"."sme_health_check_images"`);
  }
}
