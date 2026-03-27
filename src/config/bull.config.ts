import { SharedBullAsyncConfiguration } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { QueueOptions } from 'bullmq';
import { AppConfig } from './app.config';

export const REDIS_URL_RE = /rediss?:\/\/(?:(.*?):(.*?)@)?([^:]+):(\d+)\/(\d+)/;

const extractConfigFromURL = (url: string) => {
  const matches = url.match(REDIS_URL_RE)!;
  const [, username = '', password = '', host, port, db = '0'] = matches;

  return { username, password, host, port: +port, db: +db };
};

const getOpts = (c: ConfigService<AppConfig>): QueueOptions => {
  const config = c.get('queue', { infer: true })!;
  const redisDbConfig = extractConfigFromURL(config.redis.url);

  return {
    connection: { ...redisDbConfig },
    prefix: config.prefix,
    defaultJobOptions: { removeOnComplete: 100, removeOnFail: 200 },
  };
};

export const bullConfigOpts: SharedBullAsyncConfiguration = {
  inject: [ConfigService],
  useFactory: (c: ConfigService<AppConfig>) => getOpts(c),
};
