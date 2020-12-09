import { Module } from '@nestjs/common';
import { WarehouseMongoService } from './warehouse-mongo.service';
import { warehouseProviders } from './warehouse.providers';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [ProvidersModule],
  providers: [WarehouseMongoService, ...warehouseProviders],
  exports: [WarehouseMongoService],
})
export class WarehouseMongoModule {}
