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

export type NinLookupArg = {
  nin: string;
  provider?: ProviderTag;
};

export type NinLookupResData = {
  nin: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  mobileNumber: string;
};

export type NinLookupRes = {
  successful: boolean;
  data: NinLookupResData | null;
  providerTag: ProviderTag;
  failureReason: string | null;
};
