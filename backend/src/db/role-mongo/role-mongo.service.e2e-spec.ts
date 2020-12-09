import { Test, TestingModule } from '@nestjs/testing';
import { RoleMongoService } from './role-mongo.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { ProvidersModule } from '../providers/providers.module';
import { roleProviders } from './role.providers';

describe('RoleMongoService (e2e)', () => {
  let service: RoleMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        ProvidersModule,
      ],
      providers: [RoleMongoService, ...roleProviders],
    }).compile();

    service = module.get<RoleMongoService>(RoleMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
