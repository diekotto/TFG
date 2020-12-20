import { Test, TestingModule } from '@nestjs/testing';
import { RoleMongoService } from './role-mongo.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { ProvidersModule } from '../providers/providers.module';
import { roleProviders } from './role.providers';
import { Mongoose } from 'mongoose';

describe('RoleMongoService (e2e)', () => {
  let service: RoleMongoService;
  let connection: Mongoose;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        ProvidersModule,
      ],
      providers: [RoleMongoService, ...roleProviders],
    }).compile();

    connection = module.get<'MONGODB_CONNECTION'>('MONGODB_CONNECTION') as any;
    service = module.get<RoleMongoService>(RoleMongoService);
  });

  afterAll(async () => {
    await connection.connection.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
