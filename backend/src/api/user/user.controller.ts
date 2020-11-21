import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { AuthorizationInterceptor } from '../interceptors/authorization.interceptor';
import { UserService } from './user.service';
import { UserDto } from './dto/user-dto';

@ApiTags('User')
@Controller('user')
@UseInterceptors(AuthorizationInterceptor)
@ApiNotFoundResponse({
  description: 'Entity not found',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  readAllUsers(): Promise<UserDto[]> {
    return this.userService.readAllUsers();
  }

  @Get('/:id')
  readUserById(@Param('id') id: string): Promise<UserDto> {
    return this.userService.readUserById(id);
  }

  @Post('/')
  createUser(@Body() body: UserDto): Promise<UserDto> {
    return this.userService.createUser(new UserDto(body));
  }
}
