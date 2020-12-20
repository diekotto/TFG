import { Logger, Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [...databaseProviders, Logger],
  exports: [...databaseProviders],
})
export class ProvidersModule {}
