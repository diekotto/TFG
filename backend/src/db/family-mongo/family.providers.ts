import { Connection } from 'mongoose';
import { FamilySchema } from './family-schema';

export const familyProviders = [
  {
    provide: 'FAMILY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Family', FamilySchema),
    inject: ['MONGODB_CONNECTION'],
  },
];
