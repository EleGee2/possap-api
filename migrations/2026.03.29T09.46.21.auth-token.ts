import { DataTypes as DataType, QueryInterface, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

type SequelizeMigration = MigrationFn<QueryInterface>;
const TABLE_NAME = 'auth_token';

export const up: SequelizeMigration = async ({ context }) => {
  await context.createTable(TABLE_NAME, {
    id: {
      type: DataType.UUID,
      primaryKey: true,
      allowNull: false,
    },
    token: {
      type: DataType.TEXT,
      allowNull: false,
    },
    type: {
      type: DataType.ENUM('password-reset', 'email-verification', 'two-factor-otp'),
      allowNull: false,
    },
    expires_at: {
      type: DataType.DATE,
      allowNull: false,
    },
    consumed_at: {
      type: DataType.DATE,
      allowNull: true,
    },
    object_id: {
      type: DataType.UUID,
      allowNull: false,
    },
    object_type: {
      type: DataType.ENUM('user'),
      allowNull: false,
    },
    attempt_count: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
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

  await context.addIndex(TABLE_NAME, {
    fields: ['token'],
    unique: true,
    name: 'auth_token_token_unique_index',
  });

  await context.addIndex(TABLE_NAME, {
    fields: ['object_id', 'object_type', 'type'],
    name: 'auth_token_object_id_object_type_type_index',
  });
};

export const down: SequelizeMigration = async ({ context }) => {
  await context.dropTable(TABLE_NAME);
};
