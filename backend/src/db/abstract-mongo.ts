import { Document } from 'mongoose';
import { Model } from 'mongoose';

export abstract class AbstractMongo<C, D extends Document> {
  protected constructor(protected model: Model<D>) {}

  async create(input: C): Promise<D> {
    const created = new this.model(input);
    await created.save();
    return created;
  }

  async findAll(): Promise<D[]> {
    return this.model.find();
  }

  async findById(id: string): Promise<D> {
    return this.model.findById(id);
  }

  async findBy(k: string, v: any): Promise<D[]> {
    const conditions = {};
    conditions[k] = v;
    return this.findByConditions(conditions);
  }

  async findOneBy(k: string, v: any): Promise<D> {
    const conditions = {};
    conditions[k] = v;
    return this.findOneByConditions(conditions);
  }

  async findByConditions(conditions: { [key: string]: any }): Promise<D[]> {
    return this.model.find(conditions as any);
  }

  async findOneByConditions(conditions: { [key: string]: any }): Promise<D> {
    return this.model.findOne(conditions as any);
  }

  async deleteOneByConditions(conditions: {
    [key: string]: any;
  }): Promise<void> {
    await this.model.deleteOne(conditions as any);
  }

  async deleteManyByConditions(conditions: {
    [key: string]: any;
  }): Promise<void> {
    await this.model.deleteMany(conditions as any);
  }
}
