import { Module } from '@nestjs/common';
import { ParishMongoService } from './parish-mongo.service';
import { parishProviders } from './parish.providers';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [ProvidersModule],
  providers: [ParishMongoService, ...parishProviders],
  exports: [ParishMongoService],
})
export class ParishMongoModule {}
