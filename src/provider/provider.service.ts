import { Injectable, Logger } from '@nestjs/common';
import { ResendService } from './resend/resend.service';
import { MonnifyService } from './monnify/monnify.service';
import { SendEmailArg } from './resend/types';
import { AppConfig } from '@config/app.config';
import { ConfigService } from '@nestjs/config';
import { ProviderTag } from '@models/provider.model';
import { NinLookupArg, NinLookupRes, NinLookupResData, SendEmailRes } from './types';
import { CacheService } from '@src/cache/cache.service';

@Injectable()
export class ProviderService {
  constructor(
    private readonly config: ConfigService<AppConfig>,
    private readonly resendService: ResendService,
    private readonly monnifyService: MonnifyService,
    private readonly cache: CacheService,
  ) {}

  private logger = new Logger(ProviderService.name);

  private getEnabledEmailProviderTag() {
    const emailConfig = this.config.get('email', { infer: true })!;
    return emailConfig.provider;
  }

  private getEnabledIdentityProviderTag() {
    return this.config.get('identity.provider', { infer: true })!;
  }

  async ninLookup(data: NinLookupArg): Promise<NinLookupRes> {
    const cacheKey = `nin:${data.nin}`;
    const cached = await this.cache.get<NinLookupResData>(cacheKey);
    if (cached) {
      return { successful: true, data: cached, providerTag: ProviderTag.Monnify, failureReason: null };
    }

    const providerTag = data.provider ?? this.getEnabledIdentityProviderTag();

    switch (providerTag) {
      case ProviderTag.Monnify: {
        const result = await this.monnifyService.ninLookup(data.nin);
        if (result.successful && result.data) {
          await this.cache.set(cacheKey, result.data, 86400);
        }
        return result;
      }
      default:
        this.logger.warn('no identity provider available to handle NIN lookup');
        return { successful: false, data: null, providerTag: ProviderTag.Monnify, failureReason: 'no identity provider configured' };
    }
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
