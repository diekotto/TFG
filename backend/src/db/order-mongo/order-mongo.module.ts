import { Module } from '@nestjs/common';
import { ProvidersModule } from '../providers/providers.module';
import { OrderMongoService } from './order-mongo.service';
import { orderProviders } from './order.providers';

@Module({
  imports: [ProvidersModule],
  providers: [OrderMongoService, ...orderProviders],
  exports: [OrderMongoService],
})
export class OrderMongoModule {}
