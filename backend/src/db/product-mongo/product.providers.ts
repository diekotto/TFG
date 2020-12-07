import { Connection } from 'mongoose';
import { ProductSchema } from './product-schema';

export const userProviders = [
  {
    provide: 'PRODUCT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Product', ProductSchema),
    inject: ['MONGODB_CONNECTION'],
  },
];
