import {
  Table,
  Column,
  DataType,
  ForeignKey,
  Model,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { v7 } from 'uuid';
import { User } from './user.model';

interface UserAuthAttributes {
  id?: string;
  password: string;
  pin?: string | null;
  user_id: string;
}

@Table({ tableName: 'user_auth' })
export class UserAuth extends Model<UserAuthAttributes> {
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
  password: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  pin: string | null;

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
