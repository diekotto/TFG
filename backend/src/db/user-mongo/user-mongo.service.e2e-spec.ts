import { Test, TestingModule } from '@nestjs/testing';
import { UserMongoService } from './user-mongo.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { ProvidersModule } from '../providers/providers.module';
import { userProviders } from './user.providers';

describe('UserMongoService (e2e)', () => {
  let service: UserMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        ProvidersModule,
      ],
      providers: [UserMongoService, ...userProviders],
    }).compile();

    service = module.get<UserMongoService>(UserMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
