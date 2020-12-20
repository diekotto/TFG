import { Test, TestingModule } from '@nestjs/testing';
import { OrderMongoService } from './order-mongo.service';
import { orderProviders } from './order.providers';
import { ProvidersModule } from '../providers/providers.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { Mongoose } from 'mongoose';

describe('OrderMongoService (e2e)', () => {
  let service: OrderMongoService;
  let connection: Mongoose;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        ProvidersModule,
      ],
      providers: [OrderMongoService, ...orderProviders],
    }).compile();

    connection = module.get<'MONGODB_CONNECTION'>('MONGODB_CONNECTION') as any;
    service = module.get<OrderMongoService>(OrderMongoService);
  });

  afterAll(async () => {
    await connection.connection.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
