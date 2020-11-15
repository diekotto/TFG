import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EanModule } from './api/ean/ean.module';

@Module({
  imports: [EanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
