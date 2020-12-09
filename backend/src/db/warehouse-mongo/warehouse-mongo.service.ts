import { Inject, Injectable } from '@nestjs/common';
import { AbstractMongo } from '../abstract-mongo';
import { Warehouse, WarehouseDocument } from './warehouse-schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class WarehouseMongoService extends AbstractMongo<
  Warehouse,
  WarehouseDocument
> {
  constructor(@Inject('WAREHOUSE_MODEL') model: Model<WarehouseDocument>) {
    super(model);
  }

  readAllByHeadquarterId(id: string): Promise<WarehouseDocument[]> {
    const conditions = {
      _id: new ObjectId(id),
    };
    return this.findByConditions(conditions);
  }
}
