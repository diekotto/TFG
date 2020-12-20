import { Inject, Injectable } from '@nestjs/common';
import { AbstractMongo } from '../abstract-mongo';
import { Order, OrderDocument } from './order-schema';
import { Model } from 'mongoose';

@Injectable()
export class OrderMongoService extends AbstractMongo<Order, OrderDocument> {
  constructor(@Inject('ORDER_MODEL') model: Model<OrderDocument>) {
    super(model);
  }
}
