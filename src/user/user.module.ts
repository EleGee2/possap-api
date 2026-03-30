import { Role } from '@models/role.model';
import { UserAuth } from '@models/user-auth.model';
import { UserRole } from '@models/user-role.model';
import { User } from '@models/user.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [SequelizeModule.forFeature([User, UserAuth, UserRole, Role])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
