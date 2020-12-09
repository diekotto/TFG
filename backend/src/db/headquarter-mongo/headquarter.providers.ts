import { Connection } from 'mongoose';
import { HeadquarterSchema } from './headquarter-schema';

export const headquarterProviders = [
  {
    provide: 'HEADQUARTER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Headquarter', HeadquarterSchema),
    inject: ['MONGODB_CONNECTION'],
  },
];
