import { Test, TestingModule } from '@nestjs/testing';
import { NotificationMongoService } from './notification-mongo.service';
import { ProvidersModule } from '../providers/providers.module';
import { notificationProviders } from './notification-providers';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { Mongoose } from 'mongoose';

describe('NotificationMongoService (e2e)', () => {
  let service: NotificationMongoService;
  let connection: Mongoose;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        ProvidersModule,
      ],
      providers: [NotificationMongoService, ...notificationProviders],
    }).compile();

    connection = module.get<'MONGODB_CONNECTION'>('MONGODB_CONNECTION') as any;
    service = module.get<NotificationMongoService>(NotificationMongoService);
  });

  afterAll(async () => {
    await connection.connection.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
