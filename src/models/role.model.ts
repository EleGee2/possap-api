import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { v7 } from 'uuid';

export enum RoleSlug {
  Citizen = 'citizen',
  Officer = 'officer',
  Supervisor = 'supervisor',
  Admin = 'admin',
  SuperAdmin = 'super_admin',
}

interface RoleAttributes {
  id?: string;
  name: string;
  slug: string;
  // TODO: comeback to think about permissions structure
  // two options:
  // 1. JSONB field with permissions
  // 2. Separate table for permissions with many-to-many relations
  description?: string | null;
}

@Table({
  tableName: 'role',
  indexes: [{ fields: ['slug'], unique: true }],
})
export class Role extends Model<RoleAttributes> {
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
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  slug: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string | null;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
