import { Injectable, NotFoundException } from '@nestjs/common';
import { FamilyMongoService } from '../../db/family-mongo/family-mongo.service';
import { FamilyResponseDto } from './dto/family-response-dto';
import { FamilyDocument } from '../../db/family-mongo/family-schema';
import { ReadFilterDto } from './dto/read-filter-dto';
import { CreateFamilyDto } from './dto/create-family-dto';
import * as Crypto from 'crypto';
import { AppConfig } from '../../config/configuration';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FamilyService {
  constructor(
    private config: ConfigService<AppConfig>,
    private familyMongo: FamilyMongoService,
  ) {}

  async readAll(): Promise<FamilyResponseDto[]> {
    const all: FamilyDocument[] = await this.familyMongo.findAll();
    return all.map((f: FamilyDocument) =>
      FamilyResponseDto.fromFamilyDocument(f),
    );
  }

  async readByFilter(filter: ReadFilterDto): Promise<FamilyResponseDto[]> {
    if (filter.key === 'hashId') filter.value = this.hmac(filter.value);
    const found: FamilyDocument[] = await this.familyMongo.findBy(
      filter.key,
      filter.value,
    );
    return found.map((f: FamilyDocument) =>
      FamilyResponseDto.fromFamilyDocument(f),
    );
  }

  async create(input: CreateFamilyDto): Promise<FamilyResponseDto> {
    const hash = this.hmac(input.dni);
    const created: FamilyDocument = await this.familyMongo.create({
      hashId: hash,
      familyMembers: input.familyMembers,
      special: input.special,
      createdAt: new Date(),
    });
    return FamilyResponseDto.fromFamilyDocument(created);
  }

  async updateFamilyMembers(
    dni: string,
    quantity: number,
  ): Promise<FamilyResponseDto> {
    const hashId = this.hmac(dni);
    const family: FamilyDocument[] = await this.familyMongo.findBy(
      'hashId',
      hashId,
    );
    family[0].familyMembers = quantity;
    await family[0].save();
    if (family.length < 1) throw new NotFoundException('Family not found');
    return FamilyResponseDto.fromFamilyDocument(family[0]);
  }

  async updateSpecial(
    dni: string,
    isSpecial: boolean,
  ): Promise<FamilyResponseDto> {
    const hashId = this.hmac(dni);
    const family: FamilyDocument[] = await this.familyMongo.findBy(
      'hashId',
      hashId,
    );
    if (family.length < 1) throw new NotFoundException('Family not found');
    family[0].special = isSpecial;
    await family[0].save();
    return FamilyResponseDto.fromFamilyDocument(family[0]);
  }

  private hmac(input: string): string {
    return Crypto.createHmac(
      this.config.get('hashAlgorithm'),
      this.config.get('hashSecret'),
    )
      .update(input)
      .digest('hex');
  }
}
