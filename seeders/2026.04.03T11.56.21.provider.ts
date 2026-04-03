import { ProviderStatus, ProviderTag, ProviderType } from '@models/provider.model';
import { QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

type SequelizeMigration = MigrationFn<QueryInterface>;
const TABLE_NAME = 'provider';

export const up: SequelizeMigration = async ({ context }) => {
  await context.bulkInsert(TABLE_NAME, [
    {
      name: 'Resend',
      tag: ProviderTag.Resend,
      status: ProviderStatus.Active,
      type: ProviderType.Email,
    },
  ]);
};

export const down: SequelizeMigration = async ({ context }) => {
  await context.bulkDelete(TABLE_NAME, {});
};
