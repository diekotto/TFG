import { Module } from '@nestjs/common';
import { HeadquarterService } from './headquarter.service';
import { HeadquarterController } from './headquarter.controller';

@Module({
  providers: [HeadquarterService],
  controllers: [HeadquarterController],
})
export class HeadquarterModule {}
