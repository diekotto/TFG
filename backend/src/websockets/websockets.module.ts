import { Module } from '@nestjs/common';
import { WebsocketsService } from './websockets.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [WebsocketsService],
  exports: [WebsocketsService],
})
export class WebsocketsModule {}
