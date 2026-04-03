import { RegisterUserDto } from './dto/req.dto';

export type RegisterArg = RegisterUserDto;

export type GenericEmailJobData = {
  email: string;
  first_name: string;
  token: string;
};

export type PasswordResetEmailJobData = {
  email: string;
  firstName: string;
  resetUrl: string;
};
