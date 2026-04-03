import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronModule } from './cron/cron.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { configModuleOpts } from '@config/app.config';
import { bullConfigOpts } from '@config/bull.config';
import { sequelizeConfigOpts } from '@config/sequelize.config';
import { throttlerModuleOpts } from '@config/throttler.config';
import { BullModule } from '@nestjs/bullmq';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { loggerModuleOpts } from '@config/logger.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';
import { ProviderModule } from './provider/provider.module';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOpts),
    LoggerModule.forRootAsync(loggerModuleOpts),
    ThrottlerModule.forRootAsync(throttlerModuleOpts),
    SequelizeModule.forRootAsync(sequelizeConfigOpts),
    EventEmitterModule.forRoot(),
    BullModule.forRootAsync(bullConfigOpts),
    CronModule,
    UserModule,
    AuthModule,
    QueueModule,
    ProviderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
