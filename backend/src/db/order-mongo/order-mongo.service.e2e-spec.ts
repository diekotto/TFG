import { Test, TestingModule } from '@nestjs/testing';
import { OrderMongoService } from './order-mongo.service';

describe('OrderMongoService (e2e)', () => {
  let service: OrderMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderMongoService],
    }).compile();

    service = module.get<OrderMongoService>(OrderMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
