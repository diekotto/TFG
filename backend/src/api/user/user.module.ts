import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserMongoModule } from '../../db/user-mongo/user-mongo.module';
import { ConfigModule } from '@nestjs/config';
import { RoleMongoModule } from '../../db/role-mongo/role-mongo.module';
import { NotificationMongoModule } from '../../db/notification-mongo/notification-mongo.module';

@Module({
  imports: [
    ConfigModule,
    UserMongoModule,
    RoleMongoModule,
    NotificationMongoModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
