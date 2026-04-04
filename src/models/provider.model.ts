import { Column, DataType, Model, Table } from 'sequelize-typescript';

export enum ProviderTag {
  Paystack = 'paystack',
  MockProvider = 'mock-provider',
  Resend = 'resend',
  Monnify = 'monnify',
}

export enum ProviderStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export enum ProviderType {
  Payment = 'payment',
  Email = 'email',
  Identity = 'identity',
}

export interface ProviderMeta {
  [key: string]: unknown;
}

interface ProviderAttributes {
  id?: number;
  name: string;
  tag: ProviderTag;
  status: ProviderStatus;
  type: ProviderType;
  meta?: ProviderMeta;
}

@Table({
  tableName: 'provider',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Provider extends Model<ProviderAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(ProviderTag)),
    allowNull: false,
  })
  tag: ProviderTag;

  @Column({
    type: DataType.ENUM(...Object.values(ProviderStatus)),
    allowNull: false,
    defaultValue: ProviderStatus.Active,
  })
  status: ProviderStatus;

  @Column({
    type: DataType.ENUM(...Object.values(ProviderType)),
    allowNull: false,
  })
  type: ProviderType;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  meta: ProviderMeta | null;
}
