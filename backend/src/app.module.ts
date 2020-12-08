import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EanModule } from './api/ean/ean.module';
import { ConfigModule } from '@nestjs/config';
import { UserMongoModule } from './db/user-mongo/user-mongo.module';
import { ProvidersModule } from './db/providers/providers.module';
import { UserModule } from './api/user/user.module';
import { LoginModule } from './api/login/login.module';
import { RoleMongoModule } from './db/role-mongo/role-mongo.module';
import { ProductModule } from './api/product/product.module';
import { ProductMongoModule } from './db/product-mongo/product-mongo.module';
import { HeadquarterMongoModule } from './db/headquarter-mongo/headquarter-mongo.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    EanModule,
    UserMongoModule,
    ProvidersModule,
    UserModule,
    LoginModule,
    RoleMongoModule,
    ProductModule,
    ProductMongoModule,
    HeadquarterMongoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
