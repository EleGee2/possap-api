import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { AuthSessionController } from './auth-session.controller';
import { UserAuthGuard } from './user-auth.guard';
import { UserRoleGuard } from './user-role.guard';
import { User } from '@models/user.model';
import { AuthToken } from '@models/auth-token.model';
import { UserAuth } from '@models/user-auth.model';
import { UserRole } from '@models/user-role.model';
import { Role } from '@models/role.model';
import { AuthSession } from '@models/auth-session.model';
import { PasswordResetController } from './password-reset.controller';
import { EmailVerificationController } from './email-verification.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, AuthToken, UserAuth, UserRole, Role, AuthSession])],
  controllers: [AuthSessionController, PasswordResetController, EmailVerificationController],
  providers: [AuthService, UserAuthGuard, UserRoleGuard],
  exports: [AuthService, UserAuthGuard, UserRoleGuard],
})
export class AuthModule {}
