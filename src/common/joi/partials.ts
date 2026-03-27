import { isBefore, isSameDay } from 'date-fns';
import Joi from 'joi';
import { errors } from 'joi-errors';

export const phoneNumberSchema = Joi.string()
  .regex(/^\+\d{9,}$/)
  .messages({
    [errors.string.pattern_base]:
      'invalid phone number, format should be in intl format - e.g +2341234567890, +441234567890',
  });

export const currencySchema = Joi.string().length(3).uppercase();

export const paginationSchema = Joi.object({
  page: Joi.number().positive().default(1),
  size: Joi.number().positive().default(10),
});

type FromToSchemaVal = { from: string; to: string } & Record<string, unknown>;
export const fromToSchema = Joi.object({
  from: Joi.string().isoDate(),
  to: Joi.string().isoDate(),
}).custom((value: FromToSchemaVal) => {
  const { from, to } = value;

  if (!(from && to)) {
    return value;
  }

  if (isSameDay(from, to)) {
    return value;
  }

  if (!isBefore(from, to)) {
    throw new Error('"from" must be before "to"');
  }

  return value;
});
