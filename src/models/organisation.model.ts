import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { v7 } from 'uuid';

export enum OrganisationType {
  SoleProprietorship = 'sole_proprietorship',
  GeneralPartnership = 'general_partnership',
  LimitedPartnership = 'limited_partnership',
  PrivateLimitedCompany = 'private_limited_company',
  PublicLimitedCompany = 'public_limited_company',
  CompanyLimitedByGuarantee = 'company_limited_by_guarantee',
  IncorporatedTrustees = 'incorporated_trustees',
}

interface OrganisationAttributes {
  id?: string;
  name: string;
  identification_number: string;
  type: OrganisationType;
  address: string;
  is_active: boolean;
}

@Table({
  tableName: 'organisation',
})
export class Organisation extends Model<OrganisationAttributes> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: v7,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  identification_number: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(OrganisationType),
    allowNull: false,
  })
  type: OrganisationType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_active: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
