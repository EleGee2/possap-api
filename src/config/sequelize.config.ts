import { ConfigService } from '@nestjs/config';
import {
  SequelizeModule,
  SequelizeModuleAsyncOptions,
  SequelizeModuleOptions,
} from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { AppConfig, AppEnv } from './app.config';

const getOpts = (c: ConfigService<AppConfig>): SequelizeModuleOptions => {
  const logger = new Logger(SequelizeModule.name);
  const db = c.get('database', { infer: true })!;
  const appEnv = c.get('appEnv', { infer: true })!;
  const enableSSL = appEnv !== AppEnv.Local;

  const opts: SequelizeModuleOptions = {
    dialect: 'postgres',
    uri: db.url,
    pool: db.pool,
    synchronize: false,
    logging: (sql: string) => logger.verbose(sql),
    autoLoadModels: true,
  };

  if (enableSSL) {
    opts.dialectOptions = { ssl: { rejectUnauthorized: false } };
  }

  return opts;
};

export const sequelizeConfigOpts: SequelizeModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (c: ConfigService<AppConfig>) => getOpts(c),
};
