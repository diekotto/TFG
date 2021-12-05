import { Module } from '@nestjs/common';
import { ParishController } from './parish.controller';
import { ParishService } from './parish.service';
import { ConfigModule } from '@nestjs/config';
import { ParishMongoModule } from '../../db/parish-mongo/parish-mongo.module';

@Module({
  imports: [ConfigModule, ParishMongoModule],
  controllers: [ParishController],
  providers: [ParishService],
})
export class ParishModule {}
