import { Test, TestingModule } from '@nestjs/testing';
import { ParishMongoService } from './parish-mongo.service';
import { Mongoose } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { ProvidersModule } from '../providers/providers.module';
import { parishProviders } from './parish.providers';
import { ParishDocument } from './parish-schema';

describe('ParishMongoService', () => {
  let service: ParishMongoService;
  let connection: Mongoose;
  const testingCode = 'test';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        ProvidersModule,
      ],
      providers: [ParishMongoService, ...parishProviders],
    }).compile();

    connection = module.get<'MONGODB_CONNECTION'>('MONGODB_CONNECTION') as any;
    service = module.get<ParishMongoService>(ParishMongoService);
  });

  afterEach(async () => {
    await service.deleteManyByConditions({ code: testingCode });
  });

  afterAll(async () => {
    await connection.connection.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should insert', async () => {
    const name = 'Testing insertion';
    const document = await service.create({
      code: testingCode,
      name,
    });
    expect(document).toBeDefined();
    expect(document.code).toBe(testingCode);
    expect(document.name).toBe(name);
    expect(document.id).toBeDefined();
  });

  it('Should find by code', async () => {
    const name = 'Testing search';
    const document = await service.create({
      code: testingCode,
      name,
    });
    expect(document).toBeDefined();
    expect(document.code).toBe(testingCode);
    expect(document.name).toBe(name);
    expect(document.id).toBeDefined();
    const result: ParishDocument[] = await service.findByConditions({
      code: testingCode,
    });
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
    for (const item of result) {
      expect(item.code).toBe(testingCode);
      expect(item.name).toBe(name);
      expect(item.id).toBeDefined();
    }
  });
});
