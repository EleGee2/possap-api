import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResendEmailVerificationReqDto, VerifyEmailReqDto } from './dto/req.dto';
import { BodySchema } from '@common/joi';
import { resendEmailVerificationReqSchema, verifyEmailReqSchema } from './schema/req.schema';
import { Request } from 'express';
import { UAParser } from 'my-ua-parser';
import { SuccessResponseObject } from '@common/utils/http';

@ApiTags('Email Verifications')
@Controller({ path: 'email-verifications', version: '1' })
export class EmailVerificationController {
  constructor(private readonly service: AuthService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @BodySchema(resendEmailVerificationReqSchema)
  @Post('resend')
  async resendEmailVerification(@Body() body: ResendEmailVerificationReqDto) {
    await this.service.resendEmailVerification(body.email);
  }

  @BodySchema(verifyEmailReqSchema)
  @Post('verify')
  async verifyEmail(@Body() body: VerifyEmailReqDto, @Req() req: Request) {
    const ip = req.ip ?? '::1';
    const userAgent = req.headers['user-agent'];
    const parser = new UAParser(userAgent);
    const device = parser.getDevice().model;
    const os = parser.getOS().name;

    const data = await this.service.completeEmailVerification({
      email: body.email,
      token: body.token,
      meta: { ip, userAgent, device, os },
    });

    return new SuccessResponseObject('email verified successfully', data);
  }
}
