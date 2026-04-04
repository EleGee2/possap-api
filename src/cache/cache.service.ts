import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@config/app.config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private logger = new Logger(CacheService.name);

  constructor(private readonly config: ConfigService<AppConfig>) {}

  onModuleInit() {
    const url = this.config.get('cache.redisUrl', { infer: true })!;
    this.client = new Redis(url);
    this.client.on('error', (err) => this.logger.error(err, 'Redis cache error'));
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await this.client.setex(key, ttlSeconds, JSON.stringify(value));
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
