import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseMongoService } from './warehouse-mongo.service';
import { warehouseProviders } from './warehouse.providers';
import { ProvidersModule } from '../providers/providers.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';

describe('WarehouseMongoService (e2e)', () => {
  let service: WarehouseMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        ProvidersModule,
      ],
      providers: [WarehouseMongoService, ...warehouseProviders],
    }).compile();

    service = module.get<WarehouseMongoService>(WarehouseMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
