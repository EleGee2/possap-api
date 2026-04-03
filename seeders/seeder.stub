import { QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

type SequelizeMigration = MigrationFn<QueryInterface>;
const TABLE_NAME = '__xxxx__';

export const up: SequelizeMigration = async ({ context }) => {
  await context.bulkInsert(TABLE_NAME, []);
};

export const down: SequelizeMigration = async ({ context }) => {
  await context.bulkDelete(TABLE_NAME, {});
};
