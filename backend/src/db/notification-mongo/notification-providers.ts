import { Connection } from 'mongoose';
import { NotificationSchema } from './notification-schema';

export const notificationProviders = [
  {
    provide: 'NOTIFICATION_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Notification', NotificationSchema),
    inject: ['MONGODB_CONNECTION'],
  },
];
