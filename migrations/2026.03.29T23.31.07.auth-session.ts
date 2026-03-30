import { AuthSessionStatus } from '@models/auth-session.model';
import { DataTypes as DataType, QueryInterface, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

type SequelizeMigration = MigrationFn<QueryInterface>;
const TABLE_NAME = 'auth_session';

export const up: SequelizeMigration = async ({ context }) => {
  await context.createTable(TABLE_NAME, {
    id: {
      type: DataType.UUID,
      primaryKey: true,
      allowNull: false,
    },
    status: {
      type: DataType.ENUM,
      values: Object.values(AuthSessionStatus),
      allowNull: false,
    },
    device_meta: {
      type: DataType.JSONB,
      allowNull: false,
    },
    ip: {
      type: DataType.TEXT,
      allowNull: false,
    },
    location: {
      type: DataType.TEXT,
      allowNull: true,
    },
    user_id: {
      type: DataType.UUID,
      allowNull: false,
      references: { model: 'user' },
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
