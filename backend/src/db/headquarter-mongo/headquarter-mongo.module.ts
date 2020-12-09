import { Module } from '@nestjs/common';
import { HeadquarterMongoService } from './headquarter-mongo.service';
import { headquarterProviders } from './headquarter.providers';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [ProvidersModule],
  providers: [HeadquarterMongoService, ...headquarterProviders],
  exports: [HeadquarterMongoService],
})
export class HeadquarterMongoModule {}
