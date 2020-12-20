import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseService } from './warehouse.service';
import { WarehouseMongoService } from '../../db/warehouse-mongo/warehouse-mongo.service';

describe('WarehouseService', () => {
  let service: WarehouseService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarehouseService, WarehouseMongoService],
    })
      .overrideProvider(WarehouseMongoService)
      .useValue({})
      .compile();

    service = module.get<WarehouseService>(WarehouseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
