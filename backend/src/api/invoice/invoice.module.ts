import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { OrderMongoModule } from '../../db/order-mongo/order-mongo.module';
import { ConfigModule } from '@nestjs/config';
import { WebsocketsModule } from '../../websockets/websockets.module';

@Module({
  imports: [ConfigModule, OrderMongoModule, WebsocketsModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
