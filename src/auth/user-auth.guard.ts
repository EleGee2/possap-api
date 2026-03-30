import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from './types';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = req.headers['authorization'];
    const token = authHeader?.replace(/^bearer\s/gi, '') ?? null;

    if (!token) {
      throw new UnauthorizedException('invalid or missing authorization token');
    }

    const user = await this.authService.verifyUserAuthToken(token);

    req.user = user;

    return true;
  }
}
