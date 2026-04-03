import { QueueWorker } from '@common/decorators';
import { WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ProviderService } from '@src/provider/provider.service';
import { EmailJob, QueueName } from '@src/queue/constants';
import { Job } from 'bullmq';
import { GenericEmailJobData, PasswordResetEmailJobData } from './types';

@QueueWorker(QueueName.Email)
export class UserWorker extends WorkerHost {
  constructor(private readonly providerService: ProviderService) {
    super();
  }

  private logger = new Logger(UserWorker.name);

  async process(job: Job<any, any, EmailJob>) {
    switch (job.name) {
      case EmailJob.SendVerificationEmail:
        return this.handleSendVerificationEmail(job.data);
      case EmailJob.SendPasswordResetEmail:
        return this.handleSendPasswordResetEmail(job.data);
      default:
        return this.logger.warn(job.toJSON(), 'no handler for passed download job');
    }
  }

  private async handleSendPasswordResetEmail(data: PasswordResetEmailJobData) {
    this.logger.log(data, `handling ${EmailJob.SendPasswordResetEmail} job`);
    return this.providerService.sendEmail({
      to: data.email,
      subject: 'Reset your password',
      template: {
        id: 'password-reset',
        variables: {
          firstName: data.firstName,
          resetUrl: data.resetUrl,
        },
      },
    });
  }

  private async handleSendVerificationEmail(data: GenericEmailJobData) {
    this.logger.log(data, `handling ${EmailJob.SendVerificationEmail} job`);

    const { token } = data;
    return this.providerService.sendEmail({
      to: data.email,
      subject: 'Verify your email',
      template: {
        id: 'email_verify',
        variables: {
          firstName: data.first_name,
          d1: token[0],
          d2: token[1],
          d3: token[2],
          d4: token[3],
          d5: token[4],
          d6: token[5],
        },
      },
    });
  }
}
