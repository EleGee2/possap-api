import { ProviderStatus, ProviderTag, ProviderType } from '@models/provider.model';
import { DataTypes as DataType, QueryInterface, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

type SequelizeMigration = MigrationFn<QueryInterface>;
const TABLE_NAME = 'provider';

export const up: SequelizeMigration = async ({ context }) => {
  await context.createTable(TABLE_NAME, {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
    },
    tag: {
      type: DataType.ENUM(ProviderTag.Paystack),
      allowNull: false,
    },
    status: {
      type: DataType.ENUM(ProviderStatus.Active, ProviderStatus.Inactive),
      allowNull: false,
      defaultValue: ProviderStatus.Active,
    },
    type: {
      type: DataType.ENUM(ProviderType.Payment, ProviderType.Email),
      allowNull: false,
    },
    meta: {
      type: DataType.JSONB,
      allowNull: true,
    },
    created_at: {
      type: DataType.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      type: DataType.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
  });
};

export const down: SequelizeMigration = async ({ context }) => {
  await context.dropTable(TABLE_NAME);
};
