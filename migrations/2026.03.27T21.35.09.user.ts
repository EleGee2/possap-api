import { DataTypes as DataType, QueryInterface, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

type SequelizeMigration = MigrationFn<QueryInterface>;
const TABLE_NAME = 'user';

export const up: SequelizeMigration = async ({ context }) => {
  await context.createTable(TABLE_NAME, {
    id: {
      type: DataType.UUID,
      primaryKey: true,
      allowNull: false,
    },
    account_type: {
      type: DataType.ENUM('individual', 'coporate'),
      allowNull: false,
    },
    id_type: {
      type: DataType.ENUM('nin', 'bvn', 'passport', 'drivers_licence'),
      allowNull: false,
    },
    id_number: {
      type: DataType.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataType.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataType.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataType.DATE,
      allowNull: false,
    },
    gender: {
      type: DataType.STRING,
      allowNull: false,
    },
    phone: {
      type: DataType.STRING,
      allowNull: false,
    },
    phone_verified: {
      type: DataType.BOOLEAN,
      allowNull: false,
    },
    email: {
      type: DataType.STRING,
      allowNull: false,
    },
    email_verified: {
      type: DataType.BOOLEAN,
      allowNull: false,
    },
    state: {
      type: DataType.STRING,
      allowNull: true,
    },
    lga: {
      type: DataType.STRING,
      allowNull: true,
    },
    address: {
      type: DataType.STRING,
      allowNull: true,
    },
    failed_login_count: {
      type: DataType.INTEGER,
      allowNull: true,
    },
    locked_until: {
      type: DataType.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataType.BOOLEAN,
      allowNull: false,
    },
    meta: {
      type: DataType.JSONB,
      allowNull: true,
    },
    last_login: {
      type: DataType.DATE,
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
