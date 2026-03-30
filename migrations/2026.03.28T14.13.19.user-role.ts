import { DataTypes as DataType, QueryInterface, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

type SequelizeMigration = MigrationFn<QueryInterface>;
const TABLE_NAME = 'user_role';

export const up: SequelizeMigration = async ({ context }) => {
  await context.createTable(TABLE_NAME, {
    id: {
      type: DataType.UUID,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataType.UUID,
      allowNull: false,
      references: { model: 'user', key: 'id' },
    },
    role_id: {
      type: DataType.UUID,
      allowNull: false,
      references: { model: 'role', key: 'id' },
    },
    status: {
      type: DataType.ENUM('pending', 'active', 'inactive'),
      allowNull: false,
    },
    is_active: {
      type: DataType.BOOLEAN,
      allowNull: false,
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
    fields: ['user_id', 'role_id'],
    unique: true,
    name: 'user_role_user_id_role_id_unique_index',
  });

  await context.addIndex(TABLE_NAME, {
    fields: ['role_id'],
    name: 'user_role_role_id_index',
  });
};

export const down: SequelizeMigration = async ({ context }) => {
  await context.dropTable(TABLE_NAME);
};
