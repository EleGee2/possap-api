import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UserAuthGuard } from './user-auth.guard';
import { UserRoleGuard } from './user-role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticatedRequest } from './types';

export const UserAuthentication = () => applyDecorators(UseGuards(UserAuthGuard), ApiBearerAuth());

export const AuthedUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

  return req.user;
});

export const ROLES_KEY = 'roles';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const RoleAuthentication = () =>
  applyDecorators(UseGuards(UserAuthGuard, UserRoleGuard), ApiBearerAuth());
