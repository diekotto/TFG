import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { AbstractMongo } from '../abstract-mongo';
import { Parish, ParishDocument } from './parish-schema';

@Injectable()
export class ParishMongoService extends AbstractMongo<Parish, ParishDocument> {
  constructor(@Inject('PARISH_MODEL') model: Model<ParishDocument>) {
    super(model);
  }
}
