import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { User, UserDocument } from './user-schema';
import { AbstractMongo } from '../abstract-mongo';

@Injectable()
export class UserMongoService extends AbstractMongo<User, UserDocument> {
  constructor(
    @Inject('USER_MODEL')
    model: Model<UserDocument>,
  ) {
    super(model);
  }
}
