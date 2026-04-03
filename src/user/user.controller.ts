import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { BodySchema } from '@common/joi';
import { registerUserSchema } from './schema/req.schema';
import { RegisterUserDto } from './dto/req.dto';
import { SuccessResponseObject } from '@common/utils/http';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserResDto } from './dto/res.dto';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly service: UserService) {}

  @BodySchema(registerUserSchema)
  @Post()
  async register(@Body() body: RegisterUserDto): Promise<RegisterUserResDto> {
    const data = await this.service.register(body);

    return new SuccessResponseObject('user created successfully', data);
  }
}
