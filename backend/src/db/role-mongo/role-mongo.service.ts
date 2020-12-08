import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { Role, RoleDocument, RoleName } from './role-schema';
import { AbstractMongo } from '../abstract-mongo';

@Injectable()
export class RoleMongoService extends AbstractMongo<Role, RoleDocument> {
  constructor(
    @Inject('ROLE_MODEL')
    model: Model<RoleDocument>,
  ) {
    super(model);
  }

  async findByUserIdAndRoleName(
    userId: string,
    roleName: RoleName,
  ): Promise<RoleDocument> {
    return this.findOneByConditions({
      userId,
      roleName,
    });
  }

  async deleteByUserIdAndRoleName(
    userId: string,
    roleName: RoleName,
  ): Promise<void> {
    await this.deleteOneByConditions({
      userId,
      roleName,
    });
  }
}
