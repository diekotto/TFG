import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { UserDocument } from './user-schema';
import { UserDto } from '../../api/user/dto/user-dto';

@Injectable()
export class UserMongoService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<UserDocument>,
  ) {}

  async create(user: Partial<UserDto>): Promise<UserDocument> {
    const created: UserDocument = new this.userModel(user);
    await created.save();
    return created;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async find(key: string, value: any): Promise<UserDocument[]> {
    const query = {};
    query[key] = value;
    return this.userModel.find(query);
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }
}
