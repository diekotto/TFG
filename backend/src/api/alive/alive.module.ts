import { Module } from '@nestjs/common';
import { AliveController } from './alive.controller';

@Module({
  controllers: [AliveController],
})
export class AliveModule {}
