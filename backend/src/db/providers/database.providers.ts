import * as mongoose from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/configuration';
import { Logger, LoggerService } from '@nestjs/common';

export const databaseProviders = [
  {
    provide: 'MONGODB_CONNECTION',
    imports: [ConfigModule],
    inject: [ConfigService, Logger],
    useFactory: (
      configService: ConfigService<AppConfig>,
      logger: LoggerService,
    ): Promise<typeof mongoose> => {
      logger.log('CONNECTION MADE', 'ProvidersModule');
      return mongoose.connect(configService.get('mongoUrl'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    },
  },
];
