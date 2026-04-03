import { Global, Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from './constants';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({ name: QueueName.Cron }),
    BullModule.registerQueue({ name: QueueName.Email }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
