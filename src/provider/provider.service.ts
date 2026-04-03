import { Injectable, Logger } from '@nestjs/common';
import { ResendService } from './resend/resend.service';
import { SendEmailArg } from './resend/types';
import { AppConfig } from '@config/app.config';
import { ConfigService } from '@nestjs/config';
import { ProviderTag } from '@models/provider.model';
import { SendEmailRes } from './types';

@Injectable()
export class ProviderService {
  constructor(
    private readonly config: ConfigService<AppConfig>,
    private readonly resendService: ResendService,
  ) {}

  private logger = new Logger(ProviderService.name);

  private getEnabledEmailProviderTag() {
    const emailConfig = this.config.get('email', { infer: true })!;
    return emailConfig.provider;
  }

  async sendEmail(data: SendEmailArg): Promise<SendEmailRes> {
    const providerTag = data.provider || this.getEnabledEmailProviderTag();

    switch (providerTag) {
      case ProviderTag.Resend:
        return this.resendService.sendEmail(data);
      default:
        this.logger.warn('no payout provider available to handle payout');
        return Promise.resolve({
          successful: false,
          data: null,
          providerTag: ProviderTag.Resend,
          failureReason: 'unable to send email',
          providerTimeout: false,
        });
    }
  }
}
