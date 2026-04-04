import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { BodySchema, ParamSchema } from '@common/joi';
import { ninLookupParamSchema, registerUserSchema } from './schema/req.schema';
import { RegisterUserDto } from './dto/req.dto';
import { SuccessResponseObject } from '@common/utils/http';
import { ApiTags } from '@nestjs/swagger';
import { NinLookupResDto, RegisterUserResDto } from './dto/res.dto';
import { ProviderService } from '@src/provider/provider.service';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly providerService: ProviderService,
  ) {}

  @BodySchema(registerUserSchema)
  @Post()
  async register(@Body() body: RegisterUserDto): Promise<RegisterUserResDto> {
    const data = await this.service.register(body);

    return new SuccessResponseObject('user created successfully', data);
  }

  @ParamSchema(ninLookupParamSchema)
  @Get('nin/:nin')
  async ninLookup(@Param('nin') nin: string): Promise<NinLookupResDto> {
    const data = await this.providerService.ninLookup({ nin });
    return new SuccessResponseObject('nin lookup successful', data);
  }
}
