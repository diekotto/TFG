import * as mongoose from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/configuration';

export const databaseProviders = [
  {
    provide: 'MONGODB_CONNECTION',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (
      configService: ConfigService<AppConfig>,
    ): Promise<typeof mongoose> =>
      mongoose.connect(configService.get('mongoUrl'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
  },
];
