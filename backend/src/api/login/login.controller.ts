import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginService } from './login.service';
import { LoginResponseDto } from './dto/login-response-dto';
import { LoginDto } from './dto/login-dto';

@ApiTags('Login')
@Controller('login')
@ApiBadRequestResponse({
  description: 'There are params error',
})
@ApiNotFoundResponse({
  description: 'Entity not found',
})
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post('')
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    const response = {} as LoginResponseDto;
    response.user = await this.loginService.login(new LoginDto(body));
    response.jwt = this.loginService.createJwt(response.user);
    return response;
  }
}
