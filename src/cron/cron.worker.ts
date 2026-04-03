import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { CronJob, QueueName } from '@src/queue/constants';
import { QueueWorker } from '@common/decorators';

@QueueWorker(QueueName.Cron)
export class CronWorker extends WorkerHost {
  constructor() {
    super();
  }

  private logger = new Logger(CronWorker.name);

  async process(job: Job<unknown, unknown, CronJob>) {
    switch (job.name) {
      case CronJob.Init:
        return this.handleInit(job);
      default:
        return this.logger.warn(job.toJSON(), 'no handler for passed cron job');
    }
  }

  private handleInit(job: Job) {
    this.logger.log(`processing ${job.name} job`);
  }
}
