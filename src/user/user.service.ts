import { Role, RoleSlug } from '@models/role.model';
import { UserAuth } from '@models/user-auth.model';
import { UserRole, UserRoleStatus } from '@models/user-role.model';
import { User } from '@models/user.model';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { RegisterArg } from './types';
import { hashPassword } from '@common/utils/crypto';
import { AuthTokenType } from '@models/auth-token.model';
import { AuthService } from '@src/auth/auth.service';
import { QueueService } from '@src/queue/queue.service';
import { EmailJob } from '@src/queue/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly user: typeof User,
    @InjectModel(UserAuth) private readonly userAuth: typeof UserAuth,
    @InjectModel(UserRole) private readonly userRole: typeof UserRole,
    @InjectModel(Role) private readonly role: typeof Role,
    private readonly authService: AuthService,
    private readonly sequelize: Sequelize,
    private readonly queue: QueueService,
  ) {}

  private logger = new Logger(UserService.name);

  async register(data: RegisterArg) {
    const existingUser = await this.user.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('user with provided email already exists');
    }

    const transaction = await this.sequelize.transaction();

    try {
      const user = await this.user.create(
        {
          account_type: data.account_type,
          id_type: data.id_type,
          id_number: data.id_number,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          is_active: false,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          state: data.state,
          lga: data.lga,
          address: data.address,
          meta: data.meta,
          phone_verified: false,
          email_verified: false,
        },
        { transaction },
      );

      const hashedPassword = await hashPassword(data.password);
      await this.userAuth.create({ user_id: user.id, password: hashedPassword }, { transaction });

      const citizenRole = await this.role.findOne({ where: { slug: RoleSlug.Citizen } });
      if (!citizenRole) throw new Error(`role '${RoleSlug.Citizen}' not found`);
      await this.userRole.create(
        {
          user_id: user.id,
          role_id: citizenRole.id,
          status: UserRoleStatus.Inactive,
          is_active: false,
        },
        { transaction },
      );

      await transaction.commit();

      const verificationToken = await this.authService.generateVerificationToken({
        userId: user.id,
        type: AuthTokenType.EmailVerification,
        expiresInMinutes: 10,
      });

      this.logger.verbose(`verification token: ${verificationToken}`);
      await this.queue.email.add(EmailJob.SendVerificationEmail, {
        email: user.email,
        first_name: user.first_name,
        token: verificationToken,
      });

      return this.normalizeUser(user);
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new InternalServerErrorException('failed to create user');
    }
  }

  private normalizeUser(user: User) {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login: user.last_login,
    };
  }
}
