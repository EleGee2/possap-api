import { ProviderTag } from '@models/provider.model';
import { ProviderApiError } from '../errors';

export class ResendApiRequestError extends ProviderApiError {
  constructor(msg?: string) {
    const errMsg = msg || 'Resend API returned with non-2xx status';
    super(ProviderTag.Resend, errMsg);
  }
}

export class ResendUnsuccessfulRequestError extends ProviderApiError {
  constructor() {
    super(ProviderTag.Resend, 'Resend API returned 2xx with status=false');
  }
}
