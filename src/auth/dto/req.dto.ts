export class CreateAuthSessionReqDto {
  identifier: string;
  password: string;
}

export class InitPasswordResetReqDto {
  identifier: string;
}

export class CompletePasswordResetParamDto {
  token: string;
}

export class CompletePasswordResetReqDto {
  password: string;
}

export class VerifyEmailReqDto {
  token: string;
  email: string;
}

export type AuthenticatedUser = {
  id: string;
  email: string;
  is_active: boolean;
};

export type AuthenticatedRequest<T = AuthenticatedUser> = Request & {
  user: T;
};

export type FetchAuthSessionsArg = {
  userId: string;
};

export type InitPasswordResetArg = {
  identifier: string;
};

export type CompletePasswordResetArg = {
  token: string;
  password: string;
};
