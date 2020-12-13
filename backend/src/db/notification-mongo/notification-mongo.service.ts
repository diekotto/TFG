import { Inject, Injectable } from '@nestjs/common';
import { AbstractMongo } from '../abstract-mongo';
import { Notification, NotificationDocument } from './notification-schema';
import { Model } from 'mongoose';

@Injectable()
export class NotificationMongoService extends AbstractMongo<
  Notification,
  NotificationDocument
> {
  constructor(
    @Inject('NOTIFICATION_MODEL') model: Model<NotificationDocument>,
  ) {
    super(model);
  }
}
