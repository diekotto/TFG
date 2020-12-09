import { Test, TestingModule } from '@nestjs/testing';
import { HeadquarterMongoService } from './headquarter-mongo.service';
import { headquarterProviders } from './headquarter.providers';
import { ProvidersModule } from '../providers/providers.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';

describe('HeadquarterMongoService (e2e)', () => {
  let service: HeadquarterMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        ProvidersModule,
      ],
      providers: [HeadquarterMongoService, ...headquarterProviders],
    }).compile();

    service = module.get<HeadquarterMongoService>(HeadquarterMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
