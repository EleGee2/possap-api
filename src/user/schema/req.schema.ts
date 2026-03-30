import Joi from 'joi';
import { IdType, UserType } from '../../models/user.model';
import { RegisterUserDto } from '../dto/req.dto';

export const registerUserSchema = Joi.object<RegisterUserDto>({
  account_type: Joi.string()
    .valid(...Object.values(UserType))
    .required(),
  id_type: Joi.string()
    .valid(...Object.values(IdType))
    .required(),
  id_number: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().required(),
  date_of_birth: Joi.date().iso().less('now').required(),
  gender: Joi.string().trim().required(),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{7,14}$/)
    .required(),
  email: Joi.string().email().lowercase().trim().required(),
  state: Joi.string().trim().optional().allow(null),
  lga: Joi.string().trim().optional().allow(null),
  address: Joi.string().trim().optional().allow(null),
  meta: Joi.object().unknown(true).optional().allow(null),
});
