import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleName } from '../role-mongo/role-schema';

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
}

export const UserSchema = SchemaFactory.createForClass(User);
