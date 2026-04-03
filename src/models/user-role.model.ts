import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { v7 } from 'uuid';
import { Role } from './role.model';
import { User } from './user.model';

export enum UserRoleStatus {
  Pending = 'pending',
  Active = 'active',
  Inactive = 'inactive',
}

interface UserRoleAttributes {
  id?: string;
  user_id: string;
  role_id: string;
  status: UserRoleStatus;
  is_active: boolean;
}

@Table({
  tableName: 'user_role',
  indexes: [{ fields: ['user_id', 'role_id'], unique: true }],
})
export class UserRole extends Model<UserRoleAttributes> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: v7,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  role_id: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(UserRoleStatus),
    allowNull: false,
  })
  status: UserRoleStatus;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_active: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Role)
  role: Role;
}
