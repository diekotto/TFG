import { Module } from '@nestjs/common';
import { OpenfoodMongoService } from './openfood-mongo.service';
import { openfoodProviders } from './openfood.providers';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [ProvidersModule],
  providers: [OpenfoodMongoService, ...openfoodProviders],
  exports: [OpenfoodMongoService],
})
export class OpenfoodMongoModule {}
