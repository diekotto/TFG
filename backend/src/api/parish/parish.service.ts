import { Injectable } from '@nestjs/common';
import { ParishMongoService } from '../../db/parish-mongo/parish-mongo.service';
import { ParishDocument } from '../../db/parish-mongo/parish-schema';
import { ParishDto } from './dto/parish-dto';

@Injectable()
export class ParishService {
  constructor(private parishMongo: ParishMongoService) {}

  async getById(id: string): Promise<ParishDocument> {
    return this.parishMongo.findOneByConditions({ parishId: id });
  }

  async getAll(): Promise<ParishDocument[]> {
    return this.parishMongo.findAll();
  }

  async updateOrInsert(data: ParishDto): Promise<ParishDocument> {
    const parish: ParishDocument = await this.getById(data.id);
    if (parish) {
      await this.parishMongo.updateByConditions({ parishId: parish.id }, data);
      return this.getById(data.id);
    } else {
      return this.parishMongo.create(data);
    }
  }

  async delete(id: string): Promise<void> {
    return this.parishMongo.deleteOneByConditions({ parishId: id });
  }
}
