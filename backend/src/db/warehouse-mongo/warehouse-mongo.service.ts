import { Inject, Injectable } from '@nestjs/common';
import { AbstractMongo } from '../abstract-mongo';
import { Warehouse, WarehouseDocument } from './warehouse-schema';
import { Model } from 'mongoose';

@Injectable()
export class WarehouseMongoService extends AbstractMongo<
  Warehouse,
  WarehouseDocument
> {
  constructor(@Inject('WAREHOUSE_MODEL') model: Model<WarehouseDocument>) {
    super(model);
  }

  readAllByHeadquarterId(idHeadquarter: string): Promise<WarehouseDocument[]> {
    const conditions = {
      headquarter: idHeadquarter,
    };
    return this.findByConditions(conditions);
  }
}
