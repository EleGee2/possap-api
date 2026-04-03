import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppConfig } from '@config/app.config';
import { ConfigService } from '@nestjs/config';
import { MakeRequestArg, SendEmailRes } from '../types';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { LoggableAxiosError } from '@common/errors';
import { firstValueFrom, map, tap, catchError, of } from 'rxjs';
import { ResendApiRes, SendEmailArg, SendEmailResData } from './types';
import { ResendUnsuccessfulRequestError, ResendApiRequestError } from './errors';
import { ProviderApiError } from '../errors';
import { ProviderTag } from '@models/provider.model';

@Injectable()
export class ResendService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService<AppConfig>,
  ) {}

  private logger = new Logger(ResendService.name);

  private get baseUrl() {
    const resend = this.config.get('resend', { infer: true })!;
    return resend.baseUrl;
  }

  private get authHeader() {
    const resend = this.config.get('resend', { infer: true })!;
    return {
      Authorization: `Bearer ${resend.secretKey}`,
    };
  }

  private async makeRequest<D = null>(opts: MakeRequestArg) {
    const reqConfig: AxiosRequestConfig = {
      method: opts.method,
      url: opts.url,
      data: opts.body,
      params: opts.params,
      headers: { ...this.authHeader },
    };

    this.logger.verbose(reqConfig, `${opts.method.toUpperCase()} ${opts.url} req config`);

    const res = await firstValueFrom(
      this.http.request<ResendApiRes<D>>(reqConfig).pipe(
        map((r) => r.data),
        tap((r) => this.logger.debug(r, `${opts.method.toUpperCase()} ${opts.url} response`)),
        map((r) => (r.status ? r.data : new ResendUnsuccessfulRequestError())),
        catchError((e: AxiosError | Error) => {
          const errorToLog = e instanceof AxiosError ? new LoggableAxiosError(e) : e;
          this.logger.error(errorToLog);
          return of(new ResendApiRequestError());
        }),
      ),
    );

    return res;
  }

  async sendEmail(data: SendEmailArg): Promise<SendEmailRes> {
    const reqData = {
      from: 'POSSAP <noreply@possap.gov.ng>',
      to: data.to,
      subject: data.subject,
      template: {
        id: data.template.id,
        variables: data.template.variables,
      },
    };

    const res = await this.makeRequest<SendEmailResData>({
      method: 'post',
      url: `${this.baseUrl}/emails`,
      body: reqData,
    });

    if (!res || res instanceof ProviderApiError) {
      return {
        successful: false,
        data: null,
        providerTag: ProviderTag.Resend,
        failureReason: 'unable to send email',
        providerTimeout: false,
      };
    }

    return {
      successful: true,
      data: res,
      providerTag: ProviderTag.Resend,
      failureReason: null,
      providerTimeout: false,
    };
  }
}
