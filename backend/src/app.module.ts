import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EanModule } from './api/ean/ean.module';
import { ConfigModule } from '@nestjs/config';
import { UserMongoModule } from './db/user-mongo/user-mongo.module';
import { ProvidersModule } from './db/providers/providers.module';
import { UserModule } from './api/user/user.module';
import { LoginModule } from './api/login/login.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EanModule,
    UserMongoModule,
    ProvidersModule,
    UserModule,
    LoginModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
