import * as mongoose from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'MONGODB_CONNECTION',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService): Promise<typeof mongoose> =>
      mongoose.connect(configService.get('ES_MONGODB_URL'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
  },
];
