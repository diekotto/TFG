import { Test, TestingModule } from '@nestjs/testing';
import { UserMongoService } from './user-mongo.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { ProvidersModule } from '../providers/providers.module';
import { userProviders } from './user.providers';
import { Mongoose } from 'mongoose';

describe('UserMongoService (e2e)', () => {
  let service: UserMongoService;
  let connection: Mongoose;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        ProvidersModule,
      ],
      providers: [UserMongoService, ...userProviders],
    }).compile();

    connection = module.get<'MONGODB_CONNECTION'>('MONGODB_CONNECTION') as any;
    service = module.get<UserMongoService>(UserMongoService);
  });

  afterAll(async () => {
    await connection.connection.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
