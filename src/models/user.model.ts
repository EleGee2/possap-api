import { Column, CreatedAt, DataType, HasOne, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { v7 } from 'uuid';
import { UserAuth } from './user-auth.model';

export enum UserType {
  Individual = 'individual',
  Corporate = 'coporate',
}

export enum IdType {
  NIN = 'nin',
  BVN = 'bvn',
  PASSPORT = 'passport',
  DRIVERS_LICENCE = 'drivers_licence',
}

interface UserMeta {
  [key: string]: unknown;
}

interface UserAtrributes {
  id?: string;
  account_type: UserType;
  id_type: IdType;
  id_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  gender: string;
  phone: string;
  phone_verified: boolean;
  email: string;
  email_verified: boolean;
  state?: string | null;
  lga?: string | null;
  address?: string | null;
  failed_login_count?: number | null;
  locked_until?: Date | null;
  is_active: boolean;
  meta?: UserMeta | null;
  last_login?: Date | null;
}

@Table({
  tableName: 'user',
})
export class User extends Model<UserAtrributes> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: v7,
  })
  id: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(UserType),
    allowNull: false,
  })
  account_type: UserType;

  @Column({
    type: DataType.ENUM,
    values: Object.values(IdType),
    allowNull: false,
  })
  id_type: IdType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  id_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  last_name: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date_of_birth: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  gender: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  phone_verified: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  email_verified: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  state: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lga: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  failed_login_count: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  locked_until: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_active: boolean;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  meta: UserMeta | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  last_login: Date | null;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @HasOne(() => UserAuth)
  auth?: UserAuth;
}
