import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthSessionReqDto } from './dto/req.dto';
import { BodySchema } from '@common/joi';
import { createAuthSessionReqSchema } from './schema/req.schema';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UAParser } from 'my-ua-parser';
import { SuccessResponseObject } from '@common/utils/http';
import { AuthedUser, UserAuthentication } from './decorators';
import { AuthenticatedUser } from './types';

@ApiTags('Auth Sessions')
@Controller({ path: 'auth-sessions', version: '1' })
export class AuthSessionController {
  constructor(private readonly service: AuthService) {}

  @BodySchema(createAuthSessionReqSchema)
  @Post()
  async createAuthSession(@Body() body: CreateAuthSessionReqDto, @Req() req: Request) {
    const ip = req.ip ?? '::1';
    const userAgent = req.headers['user-agent'];
    const parser = new UAParser(userAgent);
    const device = parser.getDevice().model;
    const os = parser.getOS().name;

    const data = await this.service.createAuthSession({
      credentials: body,
      meta: { ip, userAgent, device, os },
    });

    return new SuccessResponseObject('session created successfully', data);
  }

  @UserAuthentication()
  @Get()
  async fetchAuthSessions(@AuthedUser() user: AuthenticatedUser) {
    const data = await this.service.fetchAuthSessions({ userId: user.id });

    return new SuccessResponseObject('sessions fetched successfully', data);
  }
}
