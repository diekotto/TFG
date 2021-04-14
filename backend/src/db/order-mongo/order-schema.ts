import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

export class ProductResume {
  @Prop() id: string;
  @Prop() ean: string;
  @Prop() code: string;
  @Prop() name: string;
  @Prop() amount: number;
  @Prop() pvp: number;
}

@Schema({
  strict: false,
})
export class Order {
  @Prop({
    index: true,
  })
  code: string; // Code for easy human identification
  @Prop() headquarter: string; // foreign key headquarter collection
  @Prop() familyName: string;
  @Prop({
    index: true,
  })
  expedient: string;
  @Prop({
    index: true,
  })
  credential: string;
  @Prop() special: boolean;
  @Prop() products: ProductResume[]; // list of ean products
  @Prop() pvp: number;
  @Prop() type: string;
  @Prop() chargeableOutBudgetSelected: boolean;
  @Prop() createdAt: Date;
  @Prop() updatedAt: Date;
  @Prop() paid: boolean;
  @Prop() deleted: boolean;
  @Prop() origin: string; // USER ID
  @Prop() resolver: string; // USER ID
}

export const OrderSchema = SchemaFactory.createForClass(Order);
