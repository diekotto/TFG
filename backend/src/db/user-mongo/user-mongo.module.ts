import { Module } from '@nestjs/common';
import { UserMongoService } from './user-mongo.service';
import { userProviders } from './user.providers';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [ProvidersModule],
  providers: [UserMongoService, ...userProviders],
  exports: [UserMongoService],
})
export class UserMongoModule {}
