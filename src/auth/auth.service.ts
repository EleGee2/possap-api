import { AppConfig } from '@config/app.config';
import { AuthToken, AuthTokenObjectType, AuthTokenType } from '@models/auth-token.model';
import { User } from '@models/user.model';
import { UserAuth } from '@models/user-auth.model';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  AuthenticatedUser,
  CompleteEmailVerificationArg,
  CompletePasswordResetArg,
  CreateAuthSessionArg,
  FetchAuthSessionsArg,
  GenerateVerificationTokenArg,
  InitPasswordResetArg,
} from './types';
import { comparePasswordWithHash, generateHash, hashPassword } from '@common/utils/crypto';
import { generateRandomChars } from '@common/utils';
import { addMinutes, isAfter } from 'date-fns';
import { UserRole, UserRoleStatus } from '@models/user-role.model';
import { Role, RoleSlug } from '@models/role.model';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import { AuthSession, AuthSessionStatus } from '@models/auth-session.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly user: typeof User,
    @InjectModel(AuthToken) private readonly authToken: typeof AuthToken,
    @InjectModel(UserAuth) private readonly userAuth: typeof UserAuth,
    @InjectModel(UserRole) private readonly userRole: typeof UserRole,
    @InjectModel(Role) private readonly role: typeof Role,
    @InjectModel(AuthSession) private readonly authSession: typeof AuthSession,
    private readonly config: ConfigService<AppConfig>,
    private readonly sequelize: Sequelize,
  ) {}

  private logger = new Logger(AuthService.name);

  private hashPasswordResetToken(token: string) {
    return generateHash(token, { alg: 'sha256', encoding: 'base64url' });
  }

  private signLoginJwt(userId: string, sessionId: string, role: string): string {
    const jwtConfig = this.config.get('jwt.login', { infer: true })!;
    return jwt.sign({ sub: userId, session: sessionId, role }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiry,
    });
  }

  private async getActiveRoleSlug(userId: string): Promise<string> {
    const userRole = await this.userRole.findOne({
      where: { user_id: userId, status: UserRoleStatus.Active, is_active: true },
      include: [{ model: Role }],
    });
    return userRole?.role?.slug ?? RoleSlug.Citizen;
  }

  async generateVerificationToken(data: GenerateVerificationTokenArg): Promise<string> {
    const { userId, type, expiresInMinutes = 10 } = data;

    const plainToken = generateRandomChars(6, 'number');
    const tokenHash = await this.hashPasswordResetToken(plainToken);

    await this.authToken.update(
      { consumed_at: new Date() },
      {
        where: {
          object_id: userId,
          object_type: AuthTokenObjectType.User,
          type,
          consumed_at: { [Op.is]: null },
        },
      },
    );

    await this.authToken.create({
      token: tokenHash,
      object_id: userId,
      object_type: AuthTokenObjectType.User,
      type,
      expires_at: addMinutes(new Date(), expiresInMinutes),
      attempt_count: 0,
    });

    return plainToken;
  }

  async completeEmailVerification(data: CompleteEmailVerificationArg) {
    const { email, token, meta } = data;

    const user = await this.user.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('Invalid ');
    }

    const tokenHash = await this.hashPasswordResetToken(token);

    const authToken = await this.authToken.findOne({
      where: {
        token: tokenHash,
        object_id: user.id,
        type: AuthTokenType.EmailVerification,
        object_type: AuthTokenObjectType.User,
      },
    });

    if (!authToken) {
      this.logger.debug('reset token not found');
      throw new UnauthorizedException('invalid or expired token');
    }

    if (authToken.consumed_at) {
      this.logger.debug('reset token already consumed');
      throw new UnauthorizedException('invalid or expired token');
    }

    if (isAfter(new Date(), authToken.expires_at)) {
      this.logger.debug('reset token expired');
      throw new UnauthorizedException('invalid or expired token');
    }

    const [, updatedAuthToken] = await this.authToken.update(
      { attempt_count: authToken.attempt_count + 1 },
      { where: { id: authToken.id }, returning: true },
    );

    if (updatedAuthToken[0].attempt_count >= 3) {
      throw new PreconditionFailedException('too many incorrect attempts, request new otp');
    }

    const transaction = await this.sequelize.transaction();

    try {
      await this.authToken.update(
        { consumed_at: new Date() },
        { where: { id: authToken.id }, transaction },
      );

      await this.user.update(
        { email_verified: true, is_active: true },
        { where: { id: user.id }, transaction },
      );

      const citizenRole = await this.role.findOne({ where: { slug: RoleSlug.Citizen } });
      if (!citizenRole) throw new Error(`role '${RoleSlug.Citizen}' not found`);
      await this.userRole.update(
        { status: UserRoleStatus.Active, is_active: true },
        { where: { user_id: user.id, role_id: citizenRole.id }, transaction },
      );

      const authSession = await this.authSession.create(
        {
          status: AuthSessionStatus.Active,
          ip: meta.ip,
          user_id: user.id,
          device_meta: { os: meta.os, device: meta.device, user_agent: meta.userAgent },
        },
        { transaction },
      );

      await transaction.commit();

      return { token: this.signLoginJwt(user.id, authSession.id, RoleSlug.Citizen) };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new InternalServerErrorException('unable to verify email successfully');
    }
  }

  async createAuthSession(data: CreateAuthSessionArg) {
    const { credentials, meta } = data;
    const user = await this.user.findOne({
      where: { email: credentials.identifier },
      include: { model: UserAuth, required: true },
    });

    if (!user || !user.auth) {
      throw new UnauthorizedException('invalid credentials');
    }

    const isValidPassword = await comparePasswordWithHash(credentials.password, user.auth.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('invalid credentials');
    }

    const authSession = await this.authSession.create({
      status: AuthSessionStatus.Active,
      ip: meta.ip,
      user_id: user.id,
      device_meta: { os: meta.os, device: meta.device, user_agent: meta.userAgent },
    });
    await user.update({ last_login: new Date() });

    const role = await this.getActiveRoleSlug(user.id);
    const token = this.signLoginJwt(user.id, authSession.id, role);

    return {
      id: authSession.id,
      status: authSession.status,
      token,
    };
  }

  async resendEmailVerification(email: string) {
    const user = await this.user.findOne({ where: { email } });

    if (!user) {
      return this.logger.warn(
        `email verification resend requested for non-existent user: ${email}`,
      );
    }

    const token = await this.generateVerificationToken({
      userId: user.id,
      type: AuthTokenType.EmailVerification,
    });

    this.logger.verbose({ email, token });
  }

  async initPasswordReset(data: InitPasswordResetArg) {
    const user = await this.user.findOne({ where: { email: data.identifier } });

    if (!user) {
      return this.logger.warn(`password reset initiated for non-existent user: ${data.identifier}`);
    }

    const expiry = addMinutes(new Date(), 120);
    const token = generateRandomChars(32, 'alphanum');

    await this.authToken.create({
      object_type: AuthTokenObjectType.User,
      object_id: user.id,
      type: AuthTokenType.PasswordReset,
      expires_at: expiry,
      token: await this.hashPasswordResetToken(token),
    });

    this.logger.verbose({ identifier: data.identifier, token });
  }

  async completePasswordReset(data: CompletePasswordResetArg) {
    const tokenHash = await this.hashPasswordResetToken(data.token);
    const authToken = await this.authToken.findOne({
      where: {
        token: tokenHash,
        type: AuthTokenType.PasswordReset,
        object_type: AuthTokenObjectType.User,
      },
    });

    if (!authToken) {
      this.logger.debug('reset token not found');
      throw new UnauthorizedException('invalid or expired token');
    }

    if (authToken.consumed_at) {
      this.logger.debug('reset token already consumed');
      throw new UnauthorizedException('invalid or expired token');
    }

    if (isAfter(new Date(), authToken.expires_at)) {
      this.logger.debug('reset token expired');
      throw new UnauthorizedException('invalid or expired token');
    }

    const user = await this.user.findByPk(authToken.object_id);

    if (!user) {
      this.logger.warn('password reset completed for non-existent user');
      throw new UnauthorizedException('invalid or expired token');
    }

    const hashedPassword = await hashPassword(data.password);

    const transaction = await this.sequelize.transaction();

    try {
      await this.userAuth.update(
        { password: hashedPassword },
        { where: { user_id: user.id }, transaction },
      );

      await authToken.update({ consumed_at: new Date() }, { transaction });

      await transaction.commit();
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new InternalServerErrorException('unable to reset password successfully');
    }
  }

  private validateJwt(token: string) {
    try {
      const jwtConfig = this.config.get('jwt.login', { infer: true })!;
      const payload = jwt.verify(token, jwtConfig.secret) as {
        sub: string;
        session: string;
        role: string;
      };
      return payload;
    } catch (error) {
      this.logger.verbose(error);
      return null;
    }
  }

  async verifyUserAuthToken(token: string): Promise<AuthenticatedUser> {
    const payload = this.validateJwt(token);

    if (!payload) {
      throw new UnauthorizedException('invalid or expired token');
    }

    const authSession = await this.authSession.findOne({
      where: { id: payload.session, status: AuthSessionStatus.Active },
    });

    if (!authSession) {
      throw new UnauthorizedException('invalid or expired token');
    }

    const user = await this.user.findByPk(payload.sub);

    if (!user) {
      throw new UnauthorizedException('invalid or expired token');
    }

    return {
      id: user.id,
      email: user.email,
      role: payload.role,
    };
  }

  async fetchAuthSessions(data: FetchAuthSessionsArg) {
    const sessions = await this.authSession.findAll({
      where: { user_id: data.userId, status: AuthSessionStatus.Active }, // TODO: add support for filtering by status
      order: [['created_at', 'DESC']],
    });

    return sessions.map((session) => this.normalizeAuthSession(session));
  }

  private normalizeAuthSession(authSession: AuthSession) {
    return {
      id: authSession.id,
      ip: authSession.ip,
      status: authSession.status,
      location: authSession.location,
      device_meta: {
        os: authSession.device_meta.os ?? null,
        device: authSession.device_meta.device ?? null,
        user_agent: authSession.device_meta.user_agent ?? null,
      },
      created_at: authSession.created_at,
    };
  }
}
