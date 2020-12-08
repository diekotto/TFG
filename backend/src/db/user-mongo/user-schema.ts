import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleName } from '../role-mongo/role-schema';
import {
  UserActionDto,
  UserCommentDto,
  UserDto,
} from '../../api/user/dto/user-dto';

export type UserDocument = User & Document;

export class UserComment {
  @Prop() author: string;
  @Prop() comment: string;
}

export class UserAction {
  @Prop() date: Date;
  @Prop() action: string;
}

@Schema()
export class User {
  @Prop() name: string;
  @Prop() email: string;
  @Prop() password: string;
  @Prop() active: boolean;
  @Prop() permissions: RoleName[];
  @Prop() accessHistory: Date[];
  @Prop() actionsHistory: UserAction[];
  @Prop() comments: UserComment[];

  constructor(o: User) {
    Object.assign(this, o);
  }

  static fromUserDto(user: UserDto): User {
    return new User({
      name: user.name,
      email: user.email,
      active: user.active,
      password: user.password,
      permissions: user.permissions.map((p: RoleName) => p),
      accessHistory: user.accessHistory.map((h: string) => new Date(h)),
      actionsHistory: user.actionsHistory.map((h: UserActionDto) => ({
        action: h.action,
        date: new Date(h.date),
      })),
      comments: user.comments.map((c: UserCommentDto) => ({
        author: c.author,
        comment: c.comment,
      })),
    });
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
