import { Test, TestingModule } from '@nestjs/testing';
import { ProductMongoService } from './product-mongo.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { ProvidersModule } from '../providers/providers.module';
import { productProviders } from './product.providers';

describe('ProductMongoService (e2e)', () => {
  let service: ProductMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        ProvidersModule,
      ],
      providers: [ProductMongoService, ...productProviders],
    }).compile();

    service = module.get<ProductMongoService>(ProductMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
