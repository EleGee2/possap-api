import dotenv from 'dotenv';
import { SequelizeStorage, Umzug } from 'umzug';
import { Sequelize } from 'sequelize';
import { readFileSync } from 'fs';
import { AppEnv } from '@config/app.config';

dotenv.config();

const { DATABASE_URL, APP_ENV = AppEnv.Local } = process.env;

if (!DATABASE_URL) {
  console.error('ERROR: No database url configured!!');
  process.exit(1);
}

const enableSSL = APP_ENV !== AppEnv.Local;

const sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
  dialectOptions: enableSSL ? { ssl: { rejectUnauthorized: false } } : {},
});

export const umzug = new Umzug({
  migrations: { glob: 'migrations/*.ts' },
  logger: console,
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'umzug_migration' }),
  create: {
    folder: 'migrations',
    template: (f) => [[f, readFileSync(`${__dirname}/../migrations/migration.stub`).toString()]],
  },
});

umzug.runAsCLI();
