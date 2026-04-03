import { Model, Table, Column, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { v7 } from 'uuid';

export enum AuthTokenType {
  PasswordReset = 'password-reset',
  EmailVerification = 'email-verification',
  TwoFactorOtp = 'two-factor-otp',
}

export enum AuthTokenObjectType {
  User = 'user',
}

interface AuthTokenAttributes {
  id?: string;
  token: string;
  type: AuthTokenType;
  expires_at: Date;
  consumed_at?: Date | null;
  object_id: string;
  object_type: AuthTokenObjectType;
  attempt_count?: number;
}

@Table({ tableName: 'auth_token' })
export class AuthToken extends Model<AuthTokenAttributes> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: v7,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  token: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(AuthTokenType),
    allowNull: false,
  })
  type: AuthTokenType;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expires_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  consumed_at: Date | null;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  object_id: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(AuthTokenObjectType),
    allowNull: false,
  })
  object_type: AuthTokenObjectType;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  attempt_count: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
