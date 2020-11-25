import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { AuthorizationInterceptor } from '../interceptors/authorization.interceptor';
import { UserService } from './user.service';
import { UserDto } from './dto/user-dto';
import { AddCommentDto } from './dto/add-comment-dto';

@ApiTags('User')
@Controller('user')
@UseInterceptors(AuthorizationInterceptor)
@ApiBadRequestResponse({
  description: 'There are params error',
})
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

  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() body: UserDto): Promise<UserDto> {
    if (id !== body.id) throw new BadRequestException("Id's does not match");
    const user = new UserDto(body);
    return this.userService.updateUser(user);
  }

  @Put('/:id/activate')
  activateUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.activateUser(id);
  }

  @Put('/:id/deactivate')
  deactivateUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.deactivateUser(id);
  }

  @Put('/:id/comment')
  addCommentToUser(
    @Param('id') id: string,
    @Body() body: AddCommentDto,
  ): Promise<UserDto> {
    return this.userService.addCommentToUser(id, new AddCommentDto(body));
  }
}
