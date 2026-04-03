import { ProviderTag } from '@models/provider.model';

export type ResendApiRes<D> = {
  status: boolean;
  message: string;
  data: D;
};

export type SendEmailArg = {
  to: string;
  subject: string;
  template: {
    id: string;
    variables?: Record<string, unknown>;
  };
  provider?: ProviderTag;
};

export type SendEmailResData = {
  id: string;
};
