import { QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

type SequelizeMigration = MigrationFn<QueryInterface>;
const TABLE_NAME = 'provider';

export const up: SequelizeMigration = async ({ context }) => {
  await context.bulkInsert(TABLE_NAME, [
    {
      name: 'Resend',
      tag: 'resend',
      description: 'Email provider',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};

export const down: SequelizeMigration = async ({ context }) => {
  await context.bulkDelete(TABLE_NAME, {});
};
