import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { Headquarter, HeadquarterDocument } from './headquarter-schema';
import { AbstractMongo } from '../abstract-mongo';

@Injectable()
export class HeadquarterMongoService extends AbstractMongo<
  Headquarter,
  HeadquarterDocument
> {
  constructor(@Inject('HEADQUARTER_MODEL') model: Model<HeadquarterDocument>) {
    super(model);
  }
}
