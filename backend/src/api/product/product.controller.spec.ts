import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { JwtGuard } from '../guards/roles/jwt.guard';
import { RolesGuard } from '../guards/roles/roles.guard';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    })
      .overrideGuard(JwtGuard)
      .useValue({})
      .overrideGuard(RolesGuard)
      .useValue({})
      .overrideProvider(ProductService)
      .useValue({})
      .compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
