import { Module } from '@nestjs/common';
import { ProvidersModule } from '../providers/providers.module';
import { ProductMongoService } from './product-mongo.service';
import { productProviders } from './product.providers';

@Module({
  imports: [ProvidersModule],
  providers: [ProductMongoService, ...productProviders],
  exports: [ProductMongoService],
})
export class ProductMongoModule {}
