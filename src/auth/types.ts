import { AuthTokenType } from '@models/auth-token.model';
import { CreateAuthSessionReqDto } from './dto/req.dto';

export type CompleteEmailVerificationArg = {
  email: string;
  token: string;
  meta: {
    ip: string;
    userAgent?: string;
    device?: string;
    os?: string;
  };
};

export type GenerateVerificationTokenArg = {
  userId: string;
  type: AuthTokenType;
  expiresInMinutes?: number;
};

export type CreateAuthSessionArg = {
  credentials: CreateAuthSessionReqDto;
  meta: {
    ip: string;
    userAgent?: string;
    device?: string;
    os?: string;
  };
};

export type InitPasswordResetArg = {
  identifier: string;
};

export type CompletePasswordResetArg = {
  token: string;
  password: string;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: string;
};

export type AuthenticatedRequest<T = AuthenticatedUser> = Request & {
  user: T;
};

export type FetchAuthSessionsArg = {
  userId: string;
};
