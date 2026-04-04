import { ProviderTag } from '@models/provider.model';
import { ProviderApiError } from '../errors';

export class MonnifyApiRequestError extends ProviderApiError {
  constructor(msg?: string) {
    super(ProviderTag.Monnify, msg || 'Monnify API returned with non-2xx status');
  }
}

export class MonnifyUnsuccessfulRequestError extends ProviderApiError {
  constructor(msg?: string) {
    super(ProviderTag.Monnify, msg || 'Monnify API returned 2xx with requestSuccessful=false');
  }
}
