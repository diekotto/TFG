import { HttpModule, Module } from '@nestjs/common';
import { EanController } from './ean.controller';
import { EanService } from './ean.service';

@Module({
  imports: [HttpModule],
  controllers: [EanController],
  providers: [EanService],
})
export class EanModule {}
