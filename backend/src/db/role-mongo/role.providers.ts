import { Connection } from 'mongoose';
import { RoleSchema } from './role-schema';

export const roleProviders = [
  {
    provide: 'ROLE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Role', RoleSchema),
    inject: ['MONGODB_CONNECTION'],
  },
];
