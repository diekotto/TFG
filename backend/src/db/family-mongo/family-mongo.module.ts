import { Module } from '@nestjs/common';
import { FamilyMongoService } from './family-mongo.service';
import { ProvidersModule } from '../providers/providers.module';
import { familyProviders } from './family.providers';

@Module({
  imports: [ProvidersModule],
  providers: [FamilyMongoService, ...familyProviders],
  exports: [FamilyMongoService],
})
export class FamilyMongoModule {}
