import { Module } from '@nestjs/common';
import { RoleMongoService } from './role-mongo.service';
import { roleProviders } from './role.providers';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [ProvidersModule],
  providers: [RoleMongoService, ...roleProviders],
  exports: [RoleMongoService],
})
export class RoleMongoModule {}
