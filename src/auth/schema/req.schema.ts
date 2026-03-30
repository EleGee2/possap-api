import Joi from 'joi';
import {
  CompletePasswordResetParamDto,
  CompletePasswordResetReqDto,
  CreateAuthSessionReqDto,
  InitPasswordResetReqDto,
  VerifyEmailReqDto,
} from '../dto/req.dto';

export const createAuthSessionReqSchema = Joi.object<CreateAuthSessionReqDto>({
  identifier: Joi.string().required(),
  password: Joi.string().required(),
});

export const initPasswordResetReqSchema = Joi.object<InitPasswordResetReqDto>({
  identifier: Joi.string().required(),
});

export const completePasswordResetParamSchema = Joi.object<CompletePasswordResetParamDto>({
  token: Joi.string().required(),
});

export const completePasswordResetReqSchema = Joi.object<CompletePasswordResetReqDto>({
  password: Joi.string().required(),
});

export const verifyEmailReqSchema = Joi.object<VerifyEmailReqDto>({
  token: Joi.string().required().length(6),
  email: Joi.string().email().required(),
});
