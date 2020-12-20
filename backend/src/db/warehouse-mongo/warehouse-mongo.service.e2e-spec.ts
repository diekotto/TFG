import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseMongoService } from './warehouse-mongo.service';
import { warehouseProviders } from './warehouse.providers';
import { ProvidersModule } from '../providers/providers.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { Mongoose } from 'mongoose';

describe('WarehouseMongoService (e2e)', () => {
  let service: WarehouseMongoService;
  let connection: Mongoose;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        ProvidersModule,
      ],
      providers: [WarehouseMongoService, ...warehouseProviders],
    }).compile();

    connection = module.get<'MONGODB_CONNECTION'>('MONGODB_CONNECTION') as any;
    service = module.get<WarehouseMongoService>(WarehouseMongoService);
  });

  afterAll(async () => {
    await connection.connection.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
