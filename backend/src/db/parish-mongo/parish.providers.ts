import { Connection } from 'mongoose';
import { ParishSchema } from './parish-schema';

export const parishProviders = [
  {
    provide: 'PARISH_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Parish', ParishSchema),
    inject: ['MONGODB_CONNECTION'],
  },
];
