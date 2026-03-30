import { BaseResponseDto } from '@config/swagger.config';

class UserDto {
  id: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login: Date | null;
}

export class RegisterUserResDto extends BaseResponseDto {
  data: UserDto;
}
