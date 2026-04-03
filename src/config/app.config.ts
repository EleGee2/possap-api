import { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';
import { REDIS_URL_RE } from './bull.config';
import { StringValue } from 'ms';
import { ProviderTag } from '@models/provider.model';

export enum AppEnv {
  Local = 'local',
  Staging = 'staging',
  PreProduction = 'pre-production',
  Production = 'production',
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  appEnv: AppEnv;
  clientUrl: string;
  logging: {
    level: string;
    requestLoggerEnabled: boolean;
  };
  throttling: {
    ttl: number;
    limit: number;
  };
  database: {
    url: string;
    pool: {
      min: number;
      max: number;
      idle: number;
    };
  };
  queue: {
    redis: { url: string };
    prefix: string;
  };
  cron: {
    init: string;
  };
  jwt: {
    login: {
      secret: string;
      expiry: StringValue;
    };
    refresh: {
      secret: string;
      expiry: StringValue;
    };
  };
  resend: {
    baseUrl: string;
    secretKey: string;
  };
  email: {
    provider: ProviderTag;
  };
}

const config = (): AppConfig => ({
  port: +process.env.PORT!,
  nodeEnv: process.env.NODE_ENV!,
  appEnv: process.env.APP_ENV! as AppEnv,
  logging: {
    level: process.env.LOGGING_LEVEL!,
    requestLoggerEnabled: Boolean(+process.env.LOGGING_REQUEST_LOGGER_ENABLED!),
  },
  throttling: {
    ttl: +process.env.THROTTLING_TTL!,
    limit: +process.env.THROTTLING_LIMIT!,
  },
  database: {
    url: process.env.DATABASE_URL!,
    pool: {
      min: +process.env.DATABASE_POOL_MIN!,
      max: +process.env.DATABASE_POOL_MAX!,
      idle: +process.env.DATABASE_POOL_IDLE_MS!,
    },
  },
  queue: {
    redis: { url: process.env.QUEUE_REDIS_URL! },
    prefix: process.env.QUEUE_PREFIX!,
  },
  cron: {
    init: process.env.CRON_INIT!,
  },
  jwt: {
    login: {
      secret: process.env.JWT_LOGIN_SECRET!,
      expiry: process.env.JWT_LOGIN_EXPIRY! as StringValue,
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET!,
      expiry: process.env.JWT_REFRESH_EXPIRY! as StringValue,
    },
  },
  resend: {
    baseUrl: process.env.RESEND_BASE_URL!,
    secretKey: process.env.RESEND_SECRET_KEY!,
  },
  email: {
    provider: process.env.EMAIL_PROVIDER! as ProviderTag,
  },
  clientUrl: process.env.CLIENT_URL!,
});

const configSchema = Joi.object({
  PORT: Joi.string().default('4000'),
  NODE_ENV: Joi.string().default('development'),
  APP_ENV: Joi.string()
    .valid(...Object.values(AppEnv))
    .required(),
  LOGGING_LEVEL: Joi.string().default('info'),
  LOGGING_REQUEST_LOGGER_ENABLED: Joi.string().allow('0', '1').default('1'),
  THROTTLING_TTL: Joi.string().default('10'),
  THROTTLING_LIMIT: Joi.string().default('100'),
  DATABASE_URL: Joi.string().required(),
  DATABASE_POOL_MIN: Joi.string().default('0'),
  DATABASE_POOL_MAX: Joi.string().default('10'),
  DATABASE_POOL_IDLE_MS: Joi.string().default('10000'),
  QUEUE_REDIS_URL: Joi.string().regex(REDIS_URL_RE).default('redis://localhost:6379/0'),
  QUEUE_PREFIX: Joi.string().default('possap'),
  CRON_INIT: Joi.string().default('* * * * *'),
  JWT_LOGIN_SECRET: Joi.string().default('YxhCx0XgwkYst5dXBtX2tvzDPc-ra509'),
  JWT_LOGIN_EXPIRY: Joi.string().default('2h'),
  RESEND_BASE_URL: Joi.string().default('https://api.resend.com'),
  RESEND_SECRET_KEY: Joi.string().default('re_xxxxxxxxx'),
  EMAIL_PROVIDER: Joi.string()
    .valid(...Object.values(ProviderTag))
    .default(ProviderTag.Resend),
  CLIENT_URL: Joi.string().uri().default('https://possap-fe.vercel.app'),
});

export const configModuleOpts: ConfigModuleOptions = {
  cache: true,
  isGlobal: true,
  load: [config],
  validationSchema: configSchema,
};
