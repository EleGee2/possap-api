import { Injectable, Logger } from '@nestjs/common';
import { EmailJob, QueueName } from './constants';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QueueName.Email)
    private readonly emailQueue: Queue<any, any, EmailJob>,
  ) {}

  private logger = new Logger(QueueService.name);

  get email() {
    return this.emailQueue;
  }
}
