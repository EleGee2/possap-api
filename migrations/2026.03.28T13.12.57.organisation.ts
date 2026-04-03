import { DataTypes as DataType, QueryInterface, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

type SequelizeMigration = MigrationFn<QueryInterface>;
const TABLE_NAME = 'organisation';

export const up: SequelizeMigration = async ({ context }) => {
  await context.createTable(TABLE_NAME, {
    id: {
      type: DataType.UUID,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
    },
    identification_number: {
      type: DataType.STRING,
      allowNull: false,
    },
    type: {
      type: DataType.ENUM(
        'sole_proprietorship',
        'general_partnership',
        'limited_partnership',
        'private_limited_company',
        'public_limited_company',
        'company_limited_by_guarantee',
        'incorporated_trustees',
      ),
      allowNull: false,
    },
    address: {
      type: DataType.STRING,
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
};

export const down: SequelizeMigration = async ({ context }) => {
  await context.dropTable(TABLE_NAME);
};
