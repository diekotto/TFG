import { Module } from '@nestjs/common';
import { NotificationMongoService } from './notification-mongo.service';
import { ProvidersModule } from '../providers/providers.module';
import { notificationProviders } from './notification-providers';

@Module({
  imports: [ProvidersModule],
  providers: [NotificationMongoService, ...notificationProviders],
  exports: [NotificationMongoService],
})
export class NotificationMongoModule {}
