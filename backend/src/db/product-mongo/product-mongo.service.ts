import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { Product, ProductDocument } from './product-schema';

@Injectable()
export class ProductMongoService {
  constructor(@Inject('PRODUCT_MODEL') private model: Model<ProductDocument>) {}

  async create(input: Product): Promise<ProductDocument> {
    const created: ProductDocument = new this.model(input);
    await created.save();
    return created;
  }

  async findAll(): Promise<ProductDocument[]> {
    return this.model.find();
  }

  async findById(id: string): Promise<ProductDocument> {
    return this.model.findById(id);
  }

  async findBy(
    key: string,
    value: string | number,
  ): Promise<ProductDocument[]> {
    const conditions = {};
    conditions[key] = value;
    return this.model.find(conditions);
  }

  async findOneBy(
    key: string,
    value: string | number,
  ): Promise<ProductDocument> {
    const conditions = {};
    conditions[key] = value;
    return this.model.findOne(conditions);
  }
}
