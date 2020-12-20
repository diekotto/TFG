import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserMongoModule } from './db/user-mongo/user-mongo.module';
import { ProvidersModule } from './db/providers/providers.module';
import { UserModule } from './api/user/user.module';
import { LoginModule } from './api/login/login.module';
import { RoleMongoModule } from './db/role-mongo/role-mongo.module';
import { ProductModule } from './api/product/product.module';
import { ProductMongoModule } from './db/product-mongo/product-mongo.module';
import { HeadquarterMongoModule } from './db/headquarter-mongo/headquarter-mongo.module';
import { WarehouseMongoModule } from './db/warehouse-mongo/warehouse-mongo.module';
import { WarehouseModule } from './api/warehouse/warehouse.module';
import { HeadquarterModule } from './api/headquarter/headquarter.module';
import { NotificationMongoModule } from './db/notification-mongo/notification-mongo.module';
import { OrderMongoModule } from './db/order-mongo/order-mongo.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ProvidersModule,
    UserMongoModule,
    RoleMongoModule,
    ProductMongoModule,
    HeadquarterMongoModule,
    WarehouseMongoModule,
    LoginModule,
    UserModule,
    ProductModule,
    HeadquarterModule,
    WarehouseModule,
    NotificationMongoModule,
    OrderMongoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
