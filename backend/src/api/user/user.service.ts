import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserMongoService } from '../../db/user-mongo/user-mongo.service';
import {
  User,
  UserAction,
  UserComment,
  UserDocument,
} from '../../db/user-mongo/user-schema';
import { UserDto } from './dto/user-dto';
import { AddCommentDto } from './dto/add-comment-dto';
import { Role, RoleDocument, RoleName } from '../../db/role-mongo/role-schema';
import { RoleMongoService } from '../../db/role-mongo/role-mongo.service';
import { hashSync } from 'bcrypt';
import { NotificationMongoService } from '../../db/notification-mongo/notification-mongo.service';
import { NotificationDocument } from '../../db/notification-mongo/notification-schema';
import { NotificationsResponseDto } from './dto/notifications-response-dto';

@Injectable()
export class UserService {
  constructor(
    private userMongo: UserMongoService,
    private roleMongo: RoleMongoService,
    private notificationMongo: NotificationMongoService,
  ) {}

  async createUser(input: UserDto): Promise<UserDto> {
    this.userValidations(input);
    const repeated: UserDocument = await this.userMongo.findOneBy(
      'email',
      input.email,
    );
    if (repeated)
      throw new ConflictException(`The email ${input.email} is in use`);
    input.password = hashSync(input.password, 10);
    const user = User.fromUserDto(input);
    return UserService.userMapper(await this.userMongo.create(user));
  }

  async readAllUsers(): Promise<UserDto[]> {
    return UserService.usersMapper(await this.userMongo.findAll());
  }

  async readUserById(id: string): Promise<UserDto> {
    const user: UserDocument = await this.userMongo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return UserService.userMapper(user);
  }

  async readAllNotificationsById(
    id: string,
  ): Promise<NotificationsResponseDto[]> {
    const user: UserDocument = await this.userMongo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    const notifications: NotificationDocument[] = await this.notificationMongo.findByConditions(
      {
        user: id,
      },
    );
    return notifications.map((n) => NotificationsResponseDto.fromDocument(n));
  }

  async activateUser(id: string): Promise<UserDto> {
    const user: UserDocument = await this.userMongo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    user.active = true;
    await user.save();
    return UserService.userMapper(user);
  }

  async deactivateUser(id: string): Promise<UserDto> {
    const user: UserDocument = await this.userMongo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    user.active = false;
    await user.save();
    return UserService.userMapper(user);
  }

  async addCommentToUser(id: string, comment: AddCommentDto): Promise<UserDto> {
    const user: UserDocument = await this.userMongo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    user.comments.push(comment.comment);
    await user.save();
    return UserService.userMapper(user);
  }

  async updateUser(input: UserDto): Promise<UserDto> {
    this.userValidations(input);
    const user: UserDocument = await this.userMongo.findById(input.id);
    if (!user) throw new NotFoundException('User not found');
    user.name = input.name;
    user.email = input.email;
    user.active = input.active;
    await user.save();
    return UserService.userMapper(user);
  }

  async addRoleToUser(userId: string, roleName: RoleName): Promise<UserDto> {
    const user: UserDocument = await this.userMongo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const roleDoc: RoleDocument = await this.roleMongo.findByUserIdAndRoleName(
      userId,
      roleName,
    );
    if (roleDoc) return UserService.userMapper(user);
    const role = new Role({
      userId,
      roleName,
    });
    await this.roleMongo.create(role);
    user.permissions.push(roleName);
    await user.save();
    return UserService.userMapper(user);
  }

  async removeRoleFromUser(
    userId: string,
    roleName: RoleName,
  ): Promise<UserDto> {
    const user: UserDocument = await this.userMongo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    await this.roleMongo.deleteByUserIdAndRoleName(userId, roleName);
    const rolePos = user.permissions.findIndex((p) => p === roleName);
    if (rolePos < 0) return UserService.userMapper(user);
    user.permissions.splice(rolePos, 1);
    user.markModified('permissions');
    await user.save();
    return UserService.userMapper(user);
  }

  static usersMapper(users: UserDocument[]): UserDto[] {
    return users.map(UserService.userMapper);
  }

  static userMapper(user: UserDocument): UserDto {
    return new UserDto({
      id: user.id,
      name: user.name,
      email: user.email,
      active: user.active,
      actionsHistory: user.actionsHistory.map((h: UserAction) => ({
        action: h.action,
        date: h.date.toISOString(),
      })),
      comments: user.comments.map((c: UserComment) => ({
        comment: c.comment,
        author: c.author,
      })),
      accessHistory: user.accessHistory.map((a: Date) => a.toISOString()),
      permissions: [...user.permissions],
    });
  }

  private userValidations(user: UserDto): void {
    if (!user.name) {
      throw new BadRequestException('User needs name');
    }
    if (!user.email) {
      throw new BadRequestException('User needs email');
    }
    if (!user.password) {
      throw new BadRequestException('User needs password');
    }
    if (user.password.length < 8) {
      throw new BadRequestException(
        'The password needs to be at least 8 char length',
      );
    }
    if (
      !user.permissions ||
      !user.permissions.every((role) => Role.validateRole(role))
    ) {
      throw new BadRequestException('User roles invalid');
    }
  }
}
