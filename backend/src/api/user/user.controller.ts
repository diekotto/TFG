import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto } from './dto/user-dto';
import { AddCommentDto } from './dto/add-comment-dto';
import { RoleName } from '../../db/role-mongo/role-schema';
import { RolesGuard } from '../guards/roles/roles.guard';
import { Roles } from '../guards/roles/roles.decorator';
import { JwtGuard } from '../guards/roles/jwt.guard';
import { NotificationsResponseDto } from './dto/notifications-response-dto';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtGuard, RolesGuard)
@ApiBadRequestResponse({
  description: 'There are params error',
})
@ApiNotFoundResponse({
  description: 'Entity not found',
})
export class UserController {
  constructor(private service: UserService) {}

  @Get('/')
  @Roles(RoleName.ADMINLOCAL)
  readAllUsers(): Promise<UserDto[]> {
    return this.service.readAllUsers();
  }

  @Get('/:id')
  @Roles(RoleName.OWNER, RoleName.ADMINLOCAL)
  async readUserById(@Param('id') id: string): Promise<UserDto> {
    const result: UserDto = await this.service.readUserById(id);
    delete result.comments;
    return result;
  }

  @Get('/:id/notifications')
  @Roles(RoleName.OWNER)
  readAllNotificationsById(
    @Param('id') id: string,
  ): Promise<NotificationsResponseDto[]> {
    return this.service.readAllNotificationsById(id);
  }

  @Post('/')
  @Roles(RoleName.ADMINLOCAL)
  createUser(@Body() body: UserDto): Promise<UserDto> {
    if (!body.password || body.password.length < 8)
      throw new BadRequestException('Bad password.');
    const input = new UserDto({
      name: body.name,
      email: body.email,
      password: body.password,
      active: !!body.active,
      permissions: [...body.permissions],
    });
    return this.service.createUser(input);
  }

  @Put('/:id')
  @Roles(RoleName.OWNER, RoleName.ADMINLOCAL)
  updateUser(@Param('id') id: string, @Body() body: UserDto): Promise<UserDto> {
    if (id !== body.id) throw new BadRequestException("Id's does not match");
    const user = new UserDto(body);
    return this.service.updateUser(user);
  }

  @Put('/:id/activate')
  @Roles(RoleName.ADMINLOCAL)
  activateUser(@Param('id') id: string): Promise<UserDto> {
    return this.service.activateUser(id);
  }

  @Put('/:id/deactivate')
  @Roles(RoleName.ADMINLOCAL)
  deactivateUser(@Param('id') id: string): Promise<UserDto> {
    return this.service.deactivateUser(id);
  }

  @Put('/:id/comment')
  @Roles(RoleName.ADMINLOCAL)
  addCommentToUser(
    @Param('id') id: string,
    @Body() body: AddCommentDto,
  ): Promise<UserDto> {
    return this.service.addCommentToUser(id, new AddCommentDto(body));
  }
}
