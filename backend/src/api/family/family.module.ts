import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { FamilyMongoModule } from '../../db/family-mongo/family-mongo.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, FamilyMongoModule],
  providers: [FamilyService],
  controllers: [FamilyController],
})
export class FamilyModule {}
