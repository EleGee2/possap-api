import { DataTypes as DataType, QueryInterface, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

type SequelizeMigration = MigrationFn<QueryInterface>;
const TABLE_NAME = 'role';

export const up: SequelizeMigration = async ({ context }) => {
  await context.createTable(TABLE_NAME, {
    id: {
      type: DataType.UUID,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataType.TEXT,
      allowNull: false,
    },
    slug: {
      type: DataType.TEXT,
      allowNull: false,
    },
    description: {
      type: DataType.TEXT,
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

  await context.addIndex(TABLE_NAME, {
    fields: ['slug'],
    unique: true,
    name: 'role_slug_unique_index',
  });
};

export const down: SequelizeMigration = async ({ context }) => {
  await context.removeIndex(TABLE_NAME, 'role_slug_unique_index');
  await context.dropTable(TABLE_NAME);
};
