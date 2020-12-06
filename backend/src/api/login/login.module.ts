import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { UserMongoModule } from '../../db/user-mongo/user-mongo.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, UserMongoModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
