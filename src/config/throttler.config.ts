import { ConfigService } from '@nestjs/config';
import { ThrottlerAsyncOptions, ThrottlerGuard, ThrottlerModuleOptions } from '@nestjs/throttler';
import { Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppConfig } from './app.config';

const getThrottlerConfig = (config: ConfigService<AppConfig>): ThrottlerModuleOptions => {
  const { ttl, limit } = config.get('throttling', { infer: true })!;
  const ttlMs = ttl * 1000;

  return [{ ttl: ttlMs, limit }];
};

export const throttlerModuleOpts: ThrottlerAsyncOptions = {
  inject: [ConfigService],
  useFactory: (c: ConfigService<AppConfig>) => getThrottlerConfig(c),
};

export const appThrottlerProvider: Provider = {
  provide: APP_GUARD,
  useClass: ThrottlerGuard,
};
