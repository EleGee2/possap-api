import { QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

type SequelizeMigration = MigrationFn<QueryInterface>;

export const up: SequelizeMigration = async ({ context }) => {
  await context.sequelize.query(`ALTER TYPE "enum_provider_tag" ADD VALUE IF NOT EXISTS 'monnify'`);
  await context.sequelize.query(
    `ALTER TYPE "enum_provider_type" ADD VALUE IF NOT EXISTS 'identity'`,
  );
};

export const down: SequelizeMigration = async ({ context }) => {
  // PostgreSQL does not support removing ENUM values natively.
  // To roll back, recreate the types without the added values.
  await context.sequelize.query(`
    ALTER TABLE provider
      ALTER COLUMN tag TYPE VARCHAR(255),
      ALTER COLUMN type TYPE VARCHAR(255)
  `);
  await context.sequelize.query(`DROP TYPE IF EXISTS "enum_provider_tag"`);
  await context.sequelize.query(`DROP TYPE IF EXISTS "enum_provider_type"`);
  await context.sequelize.query(`
    CREATE TYPE "enum_provider_tag" AS ENUM ('paystack', 'mock-provider', 'resend')
  `);
  await context.sequelize.query(`
    CREATE TYPE "enum_provider_type" AS ENUM ('payment', 'email')
  `);
  await context.sequelize.query(`
    ALTER TABLE provider
      ALTER COLUMN tag TYPE "enum_provider_tag" USING tag::"enum_provider_tag",
      ALTER COLUMN type TYPE "enum_provider_type" USING type::"enum_provider_type"
  `);
};
