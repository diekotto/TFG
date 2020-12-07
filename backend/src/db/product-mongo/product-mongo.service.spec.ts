import { Test, TestingModule } from '@nestjs/testing';
import { ProductMongoService } from './product-mongo.service';

describe('ProductMongoService', () => {
  let service: ProductMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductMongoService],
    }).compile();

    service = module.get<ProductMongoService>(ProductMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
