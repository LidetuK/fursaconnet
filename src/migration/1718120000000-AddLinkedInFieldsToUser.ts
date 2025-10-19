import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLinkedInFieldsToUser1718120000000 implements MigrationInterface {
    name = 'AddLinkedInFieldsToUser1718120000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "linkedinAccessToken" varchar NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "linkedinRefreshToken" varchar NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "linkedinTokenExpiresAt" bigint NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "linkedinUserId" varchar NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "linkedinUserId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "linkedinTokenExpiresAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "linkedinRefreshToken"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "linkedinAccessToken"`);
    }
} 
