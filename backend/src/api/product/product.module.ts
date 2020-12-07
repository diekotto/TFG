import { HttpModule, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductMongoModule } from '../../db/product-mongo/product-mongo.module';

@Module({
  imports: [HttpModule, ProductMongoModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
