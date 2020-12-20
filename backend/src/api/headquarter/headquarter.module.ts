import { Module } from '@nestjs/common';
import { HeadquarterService } from './headquarter.service';
import { HeadquarterController } from './headquarter.controller';
import { HeadquarterMongoModule } from '../../db/headquarter-mongo/headquarter-mongo.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, HeadquarterMongoModule],
  providers: [HeadquarterService],
  controllers: [HeadquarterController],
})
export class HeadquarterModule {}
