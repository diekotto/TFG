import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { Role, RoleDocument, RoleName } from './role-schema';

@Injectable()
export class RoleMongoService {
  constructor(
    @Inject('ROLE_MODEL')
    private roleModel: Model<RoleDocument>,
  ) {}

  async create(
    userId: string,
    roleName: RoleName,
    expiry?: Date,
  ): Promise<RoleDocument> {
    const role: Role = {
      userId,
      roleName,
      expiry,
    };
    const created: RoleDocument = new this.roleModel(role);
    await created.save();
    return created;
  }

  async findByUserId(userId: string): Promise<RoleDocument[]> {
    return this.roleModel.find({ userId });
  }

  async findByUserIdAndRoleName(
    userId: string,
    roleName: RoleName,
  ): Promise<RoleDocument> {
    return this.roleModel.findOne({
      userId,
      roleName,
    });
  }

  async deleteByUserIdAndRoleName(
    userId: string,
    roleName: RoleName,
  ): Promise<void> {
    await this.roleModel.deleteOne({
      userId,
      roleName,
    });
  }
}
