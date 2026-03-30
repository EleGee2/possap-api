import { AppConfig } from '@config/app.config';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronJob, QueueName } from '@common/constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CronService {
  constructor(
    @InjectQueue(QueueName.Cron) private readonly cronQueue: Queue,
    private readonly config: ConfigService<AppConfig>,
  ) {}
  private logger = new Logger(CronService.name);

  async setUpJobs() {
    this.logger.log('refreshing crons');
    const cronConfig = this.config.get('cron', { infer: true })!;

    const jobs: { name: CronJob; pattern: string }[] = [
      { name: CronJob.Init, pattern: cronConfig.init },
      // more jobs here
    ];

    await this.purgeExistingSchedulers();
    await Promise.all(
      jobs.map(({ name, pattern }) =>
        this.cronQueue.upsertJobScheduler(name, { pattern, utc: true }),
      ),
    );

    const crons = await this.cronQueue.getJobSchedulers();
    this.logger.log(crons, 'crons refreshed');
  }

  private async purgeExistingSchedulers() {
    this.logger.log('purging existing schedulers');
    const crons = await this.cronQueue.getJobSchedulers();
    await Promise.all(crons.map((cron) => this.cronQueue.removeJobScheduler(cron.name)));
  }
}
