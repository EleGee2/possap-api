import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import joi from 'joi';
import { Request } from 'express';
import { SchemaType } from '.';
import { RequestValidationException } from '@common/errors';
import { ErrorResponseObject } from '@common/utils/http';

const validationOptions: joi.ValidationOptions = {
  abortEarly: false,
  stripUnknown: true,
  convert: true, // "true" is already the lib default. just making it explicit
};

@Injectable()
export class JoiInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  private getSchema(type: SchemaType, ctx: ExecutionContext) {
    return this.reflector.get<{
      type: SchemaType;
      schema: joi.ObjectSchema;
    }>(`joi_${type}_schema`, ctx.getHandler());
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctxType = context.getType();
    if (ctxType !== 'http') {
      return next.handle();
    }

    const req: Request = context.switchToHttp().getRequest();
    const meta = [
      this.getSchema('params', context),
      this.getSchema('body', context),
      this.getSchema('query', context),
    ].filter(Boolean);

    for (const m of meta) {
      const result = m.schema.validate(req[m.type], validationOptions);

      if (result.error) {
        const errors = result.error.details.map((e) => ({
          message: e.message,
          field: e.context?.label,
          value: e.context?.value,
        }));

        throw new RequestValidationException(
          new ErrorResponseObject(`request ${m.type} failed validation`, errors),
        );
      }

      if (m.type === 'query') {
        Object.defineProperty(req, 'query', { value: result.value });
      } else {
        req[m.type] = result.value;
      }
    }

    return next.handle();
  }
}
