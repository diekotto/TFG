import { Connection } from 'mongoose';
import { OpenfoodSchema } from './openfood-schema';

export const openfoodProviders = [
  {
    provide: 'OPENFOOD_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Openfood', OpenfoodSchema),
    inject: ['MONGODB_CONNECTION'],
  },
];
