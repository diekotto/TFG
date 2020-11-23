import { Injectable } from '@nestjs/common';
import { UserMongoService } from '../../db/user-mongo/user-mongo.service';
import {
  UserAction,
  UserComment,
  UserDocument,
} from '../../db/user-mongo/user-schema';
import { UserDto } from './dto/user-dto';

@Injectable()
export class UserService {
  constructor(private userMongo: UserMongoService) {}

  async createUser(user: UserDto): Promise<UserDto> {
    return UserService.userMapper(await this.userMongo.create(user));
  }

  async readAllUsers(): Promise<UserDto[]> {
    return UserService.usersMapper(await this.userMongo.findAll());
  }

  async readUserById(id: string): Promise<UserDto> {
    return UserService.userMapper(await this.userMongo.findById(id));
  }

  async activateUser(id: string): Promise<UserDto> {
    const user: UserDocument = await this.userMongo.findById(id);
    user.active = true;
    await user.save();
    return UserService.userMapper(user);
  }

  async deactivateUser(id: string): Promise<UserDto> {
    const user: UserDocument = await this.userMongo.findById(id);
    user.active = false;
    await user.save();
    return UserService.userMapper(user);
  }

  async updateUser(input: UserDto): Promise<UserDto> {
    const user: UserDocument = await this.userMongo.findById(input.id);
    user.name = input.name;
    user.email = input.email;
    user.active = input.active;
    user.checkIn = input.checkIn;
    user.checkOut = input.checkOut;
    await user.save();
    return UserService.userMapper(user);
  }

  private static usersMapper(users: UserDocument[]): UserDto[] {
    return users.map(UserService.userMapper);
  }

  private static userMapper(user: UserDocument): UserDto {
    return new UserDto({
      id: user.id,
      name: user.name,
      email: user.email,
      active: user.active,
      actionsHistory: user.actionsHistory.map((h: UserAction) => ({
        action: h.action,
        date: h.date.toISOString(),
      })),
      comments: user.comments.map((c: UserComment) => ({ ...c })),
      accessHistory: user.accessHistory.map((a: Date) => a.toISOString()),
      checkIn: user.checkIn,
      checkOut: user.checkOut,
    });
  }
}
