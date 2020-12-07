import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop() name: string;
  @Prop() quantity: string; // peso o unidades
  @Prop() categories: string;
  @Prop() ingredients: string;
  @Prop() allergens: string;
  @Prop() labels: string;
  @Prop() imageUrl: string;

  constructor(o: Product) {
    Object.assign(this, o);
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);
