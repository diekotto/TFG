import { Connection } from 'mongoose';
import { WarehouseSchema } from './warehouse-schema';

export const warehouseProviders = [
  {
    provide: 'WAREHOUSE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Warehouse', WarehouseSchema),
    inject: ['MONGODB_CONNECTION'],
  },
];
