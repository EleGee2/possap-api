import { ProviderTag } from '@models/provider.model';

export type MakeRequestArg = {
  method: 'get' | 'post' | 'put' | 'delete';
  url: string;
  body?: Record<string, unknown>;
  params?: Record<string, unknown>;
};

type SendEmailResData = {
  id: string;
};

export type SendEmailRes = {
  successful: boolean;
  data: SendEmailResData | null;
  providerTag: ProviderTag;
  failureReason: string | null;
  providerTimeout: boolean;
};
