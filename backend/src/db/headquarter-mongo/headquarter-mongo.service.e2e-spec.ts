import { Test, TestingModule } from '@nestjs/testing';
import { HeadquarterMongoService } from './headquarter-mongo.service';
import { ProvidersModule } from '../providers/providers.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { Mongoose } from 'mongoose';
import { headquarterProviders } from './headquarter.providers';

describe('HeadquarterMongoService (e2e)', () => {
  let service: HeadquarterMongoService;
  let connection: Mongoose;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        ProvidersModule,
      ],
      providers: [HeadquarterMongoService, ...headquarterProviders],
    }).compile();

    connection = module.get<'MONGODB_CONNECTION'>('MONGODB_CONNECTION') as any;
    service = module.get<HeadquarterMongoService>(HeadquarterMongoService);
  });

  afterAll(async () => {
    await connection.connection.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
