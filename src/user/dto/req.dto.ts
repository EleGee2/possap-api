import { IdType, UserType } from '@models/user.model';

export class RegisterUserDto {
  id?: string;
  account_type: UserType;
  id_type: IdType;
  id_number: string;
  first_name: string;
  last_name: string;
  password: string;
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
  meta?: Record<string, unknown>;
  last_login?: Date | null;
}
