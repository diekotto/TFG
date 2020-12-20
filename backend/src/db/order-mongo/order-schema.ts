import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop() headquarter: string; // foreign key headquarter collection
  @Prop() family: string; // foreign key family collection
  @Prop() products: string[]; // foreign keys product collection
  @Prop() amount: number;
  @Prop() createdAt: Date;
  @Prop() updatedAt: Date;
  @Prop() charged: boolean;
  @Prop() deleted: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
