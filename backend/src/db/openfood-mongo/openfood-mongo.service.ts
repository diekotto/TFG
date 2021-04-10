import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { AbstractMongo } from '../abstract-mongo';
import { Openfood, OpenfoodDocument } from './openfood-schema';

@Injectable()
export class OpenfoodMongoService extends AbstractMongo<
  Openfood,
  OpenfoodDocument
> {
  constructor(@Inject('OPENFOOD_MODEL') model: Model<OpenfoodDocument>) {
    super(model);
  }
}
