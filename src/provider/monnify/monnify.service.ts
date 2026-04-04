import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@config/app.config';
import { MakeRequestArg, NinLookupRes } from '../types';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { LoggableAxiosError } from '@common/errors';
import { firstValueFrom, map, tap, catchError, of } from 'rxjs';
import { MonnifyApiRes, MonnifyAuthResData, MonnifyNinResData } from './types';
import { MonnifyApiRequestError, MonnifyUnsuccessfulRequestError } from './errors';
import { ProviderApiError } from '../errors';
import { ProviderTag } from '@models/provider.model';
import { CacheService } from '@src/cache/cache.service';

const MONNIFY_TOKEN_CACHE_KEY = 'monnify:access_token';

@Injectable()
export class MonnifyService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService<AppConfig>,
    private readonly cache: CacheService,
  ) {}

  private logger = new Logger(MonnifyService.name);

  private get baseUrl() {
    return this.config.get('monnify.baseUrl', { infer: true })!;
  }

  private get basicAuthHeader() {
    const { apiKey, secretKey } = this.config.get('monnify', { infer: true })!;
    const encoded = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');
    return { Authorization: `Basic ${encoded}` };
  }

  private async makeRequest<D = null>(opts: MakeRequestArg, bearerToken: string) {
    const reqConfig: AxiosRequestConfig = {
      method: opts.method,
      url: opts.url,
      data: opts.body,
      params: opts.params,
      headers: { Authorization: `Bearer ${bearerToken}` },
    };

    this.logger.verbose(reqConfig, `${opts.method.toUpperCase()} ${opts.url} req config`);

    const res = await firstValueFrom(
      this.http.request<MonnifyApiRes<D>>(reqConfig).pipe(
        map((r) => r.data),
        tap((r) => this.logger.debug(r, `${opts.method.toUpperCase()} ${opts.url} response`)),
        map((r) =>
          r.requestSuccessful
            ? r.responseBody
            : new MonnifyUnsuccessfulRequestError(r.responseMessage),
        ),
        catchError((e: AxiosError | Error) => {
          const errorToLog = e instanceof AxiosError ? new LoggableAxiosError(e) : e;
          this.logger.error(errorToLog);
          return of(new MonnifyApiRequestError());
        }),
      ),
    );

    return res;
  }

  private async authenticate(): Promise<string> {
    const cached = await this.cache.get<string>(MONNIFY_TOKEN_CACHE_KEY);
    if (cached) return cached;

    const reqConfig: AxiosRequestConfig = {
      method: 'post',
      url: `${this.baseUrl}/api/v1/auth/login`,
      headers: { ...this.basicAuthHeader },
    };

    this.logger.verbose(reqConfig, 'POST /api/v1/auth/login req config');

    const res = await firstValueFrom(
      this.http.request<MonnifyApiRes<MonnifyAuthResData>>(reqConfig).pipe(
        map((r) => r.data),
        tap((r) => this.logger.debug(r, 'POST /api/v1/auth/login response')),
        catchError((e: AxiosError | Error) => {
          const errorToLog = e instanceof AxiosError ? new LoggableAxiosError(e) : e;
          this.logger.error(errorToLog);
          return of(new MonnifyApiRequestError('Monnify authentication failed'));
        }),
      ),
    );

    if (res instanceof ProviderApiError || !res.requestSuccessful || !res.responseBody) {
      throw new Error('Failed to authenticate with Monnify');
    }

    const { accessToken, expiresIn } = res.responseBody;
    await this.cache.set(MONNIFY_TOKEN_CACHE_KEY, accessToken, expiresIn - 30);

    return accessToken;
  }

  async ninLookup(nin: string): Promise<NinLookupRes> {
    const token = await this.authenticate();

    const res = await this.makeRequest<MonnifyNinResData>(
      {
        method: 'post',
        url: `${this.baseUrl}/api/v1/vas/nin-details`,
        body: { nin },
      },
      token,
    );

    if (!res || res instanceof ProviderApiError) {
      return {
        successful: false,
        data: null,
        providerTag: ProviderTag.Monnify,
        failureReason: res instanceof ProviderApiError ? res.message : 'NIN lookup failed',
      };
    }

    return {
      successful: true,
      data: res,
      providerTag: ProviderTag.Monnify,
      failureReason: null,
    };
  }
}
