import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { UserDocument } from './user-schema';

@Injectable()
export class UserMongoService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<UserDocument>,
  ) {}

  async create(user: Partial<UserDocument>): Promise<UserDocument> {
    const created: UserDocument = new this.userModel(user);
    await created.save();
    return created;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }
}
