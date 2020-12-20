import { Connection } from 'mongoose';
import { OrderSchema } from './order-schema';

export const orderProviders = [
  {
    provide: 'ORDER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Order', OrderSchema),
    inject: ['MONGODB_CONNECTION'],
  },
];
