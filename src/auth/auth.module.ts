import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSessionController } from './auth-session.controller';
import { UserAuthGuard } from './user-auth.guard';
import { UserRoleGuard } from './user-role.guard';

@Module({
  controllers: [AuthSessionController],
  providers: [AuthService, UserAuthGuard, UserRoleGuard],
})
export class AuthModule {}

