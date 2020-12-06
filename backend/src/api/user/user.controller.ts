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
import { Role, RoleName } from '../../db/role-mongo/role-schema';
import { RolesGuard } from '../guards/roles/roles.guard';
import { Roles } from '../guards/roles/roles.decorator';
import { JwtGuard } from '../guards/roles/jwt.guard';

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
  constructor(private userService: UserService) {}

  @Get('/')
  @Roles(RoleName.ADMINLOCAL)
  readAllUsers(): Promise<UserDto[]> {
    return this.userService.readAllUsers();
  }

  @Get('/:id')
  @Roles(RoleName.OWNER, RoleName.ADMINLOCAL)
  async readUserById(@Param('id') id: string): Promise<UserDto> {
    const result: UserDto = await this.userService.readUserById(id);
    delete result.comments;
    return result;
  }

  @Post('/')
  @Roles(RoleName.ADMINLOCAL)
  createUser(@Body() body: UserDto): Promise<UserDto> {
    return this.userService.createUser(new UserDto(body));
  }

  @Put('/:id')
  @Roles(RoleName.OWNER, RoleName.ADMINLOCAL)
  updateUser(@Param('id') id: string, @Body() body: UserDto): Promise<UserDto> {
    if (id !== body.id) throw new BadRequestException("Id's does not match");
    const user = new UserDto(body);
    return this.userService.updateUser(user);
  }

  @Put('/:id/activate')
  @Roles(RoleName.ADMINLOCAL)
  activateUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.activateUser(id);
  }

  @Put('/:id/deactivate')
  @Roles(RoleName.ADMINLOCAL)
  deactivateUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.deactivateUser(id);
  }

  @Put('/:id/role/:roleName')
  @Roles(RoleName.ADMINLOCAL)
  addRoleToUser(
    @Param('id') id: string,
    @Param('roleName') roleName: RoleName,
  ): Promise<UserDto> {
    if (!Role.validateRole(roleName))
      throw new BadRequestException('Role invalid');
    return this.userService.addRoleToUser(id, roleName);
  }

  @Put('/:id/comment')
  @Roles(RoleName.ADMINLOCAL)
  addCommentToUser(
    @Param('id') id: string,
    @Body() body: AddCommentDto,
  ): Promise<UserDto> {
    return this.userService.addCommentToUser(id, new AddCommentDto(body));
  }
}
