import { Module } from '@nestjs/common';
import { CronWorker } from './cron.worker';
import { CronService } from './cron.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '@common/constants';

@Module({
  imports: [BullModule.registerQueue({ name: QueueName.Cron })],
  providers: [CronWorker, CronService],
})
export class CronModule {}
