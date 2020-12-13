import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ConfigService } from '@nestjs/config';
import { ProductMongoService } from '../../db/product-mongo/product-mongo.service';
import { HttpService } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        ProductService,
        ProductMongoService,
        HttpService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue({})
      .overrideProvider(ProductMongoService)
      .useValue({})
      .overrideProvider(HttpService)
      .useValue({})
      .compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
