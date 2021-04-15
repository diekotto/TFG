import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { Role, RoleDocument } from './role-schema';
import { AbstractMongo } from '../abstract-mongo';

@Injectable()
export class RoleMongoService extends AbstractMongo<Role, RoleDocument> {
  constructor(
    @Inject('ROLE_MODEL')
    model: Model<RoleDocument>,
  ) {
    super(model);
  }
}
