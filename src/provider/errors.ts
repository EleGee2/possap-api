import { ProviderTag } from '@models/provider.model';

export class ProviderApiError extends Error {
  constructor(providerTag: ProviderTag, msg?: string) {
    const errMsg = msg || `${providerTag} api request failed`;
    super(errMsg);
  }
}
