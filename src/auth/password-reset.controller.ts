import { Body, Controller, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  CompletePasswordResetParamDto,
  CompletePasswordResetReqDto,
  InitPasswordResetReqDto,
} from './dto/req.dto';
import { BodySchema, ParamSchema } from '@common/joi';
import {
  completePasswordResetParamSchema,
  completePasswordResetReqSchema,
  initPasswordResetReqSchema,
} from './schema/req.schema';

@ApiTags('Password Resets')
@Controller({ path: 'password-resets', version: '1' })
export class PasswordResetController {
  constructor(private readonly service: AuthService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @BodySchema(initPasswordResetReqSchema)
  @Post()
  async initPasswordReset(@Body() body: InitPasswordResetReqDto) {
    await this.service.initPasswordReset({ identifier: body.identifier });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ParamSchema(completePasswordResetParamSchema)
  @BodySchema(completePasswordResetReqSchema)
  @Put('/:token')
  async completePasswordReset(
    @Param() params: CompletePasswordResetParamDto,
    @Body() body: CompletePasswordResetReqDto,
  ) {
    await this.service.completePasswordReset({
      token: params.token,
      password: body.password,
    });
  }
}
