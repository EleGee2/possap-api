import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { v7 } from 'uuid';
import { User } from './user.model';

export enum AuthSessionStatus {
  Active = 'active',
  PendingOtp = 'pending-otp',
  Destroyed = 'destroyed',
}

export interface AuthSessionDeviceMeta {
  os?: string;
  medium?: string;
  device?: string;
  user_agent?: string;
}

interface AuthSessionAttributes {
  id?: string;
  status: AuthSessionStatus;
  device_meta: AuthSessionDeviceMeta;
  ip: string;
  location?: string | null;
  user_id: string;
}

@Table({ tableName: 'auth_session' })
export class AuthSession extends Model<AuthSessionAttributes> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: v7,
  })
  id: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(AuthSessionStatus),
    allowNull: false,
  })
  status: AuthSessionStatus;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  device_meta: AuthSessionDeviceMeta;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  ip: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  location: string | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
