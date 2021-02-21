import { Inject, Injectable } from '@nestjs/common';
import { AbstractMongo } from '../abstract-mongo';
import { Family, FamilyDocument } from './family-schema';
import { Model } from 'mongoose';

@Injectable()
export class FamilyMongoService extends AbstractMongo<Family, FamilyDocument> {
  constructor(@Inject('FAMILY_MODEL') model: Model<FamilyDocument>) {
    super(model);
  }
}
