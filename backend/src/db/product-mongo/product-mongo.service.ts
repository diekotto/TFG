import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { Product, ProductDocument } from './product-schema';
import { AbstractMongo } from '../abstract-mongo';

@Injectable()
export class ProductMongoService extends AbstractMongo<
  Product,
  ProductDocument
> {
  constructor(@Inject('PRODUCT_MODEL') model: Model<ProductDocument>) {
    super(model);
  }
}
