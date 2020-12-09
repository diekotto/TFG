import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { WarehouseMongoModule } from '../../db/warehouse-mongo/warehouse-mongo.module';

@Module({
  imports: [WarehouseMongoModule],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehouseModule {}
