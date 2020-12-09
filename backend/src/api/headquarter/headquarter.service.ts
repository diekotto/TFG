import { Injectable, NotFoundException } from '@nestjs/common';
import { HeadquarterMongoService } from '../../db/headquarter-mongo/headquarter-mongo.service';
import { HeadquarterResponseDto } from './dto/headquarter-response-dto';
import {
  Headquarter,
  HeadquarterDocument,
} from '../../db/headquarter-mongo/headquarter-schema';
import { HeadquarterDto } from './dto/headquarter-dto';

@Injectable()
export class HeadquarterService {
  constructor(private headquarterMongo: HeadquarterMongoService) {}

  async readAll(): Promise<HeadquarterResponseDto[]> {
    const all = await this.headquarterMongo.findAll();
    return all.map((h: HeadquarterDocument) =>
      HeadquarterResponseDto.fromHeadquarterDocument(h),
    );
  }

  async readByName(name: string): Promise<HeadquarterResponseDto> {
    const h = await this.headquarterMongo.findOneBy('name', name);
    return HeadquarterResponseDto.fromHeadquarterDocument(h);
  }

  async create(input: HeadquarterDto): Promise<HeadquarterResponseDto> {
    const h = new Headquarter(input);
    return HeadquarterResponseDto.fromHeadquarterDocument(
      await this.headquarterMongo.create(h),
    );
  }

  async update(input: HeadquarterDto): Promise<HeadquarterResponseDto> {
    const h = await this.headquarterMongo.findById(input.id);
    if (!h) throw new NotFoundException('Headquarter not found');
    HeadquarterService.updateHeadquarterDocument(input, h);
    await h.save();
    return HeadquarterResponseDto.fromHeadquarterDocument(h);
  }

  async delete(id: string): Promise<void> {
    await this.headquarterMongo.deleteOneByConditions({ id });
  }

  private static updateHeadquarterDocument(
    input: HeadquarterDto,
    h: HeadquarterDocument,
  ): HeadquarterDocument {
    if (input.name) h.name = input.name;
    if (input.description) h.description = input.description;
    if (input.address) h.address = input.address;
    if (input.postalCode) h.postalCode = input.postalCode;
    if (input.province) h.province = input.province;
    if (input.city) h.city = input.province;
    return h;
  }
}
