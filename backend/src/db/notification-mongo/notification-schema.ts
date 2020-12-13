import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop() user: string; // FOREIGN KEY USER_SCHEMA
  @Prop() message: string;
  @Prop() createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
