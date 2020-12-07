import { Module } from '@nestjs/common';
import { ProductMongoService } from './product-mongo.service';

@Module({
  providers: [ProductMongoService],
  exports: [ProductMongoModule],
})
export class ProductMongoModule {}
