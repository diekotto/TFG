import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop() ean: string;
  @Prop() name: string;
  @Prop() alias: string;
  @Prop() quantity: string; // peso o unidades
  @Prop() categories: string;
  @Prop() ingredients: string;
  @Prop() allergens: string;
  @Prop() labels: string;
  @Prop() imageUrl: string;
  @Prop() limits: ProductLimits[];
  @Prop() pvp: number;
  @Prop() code: string; // Inner code for every warehouse
  @Prop() warehouse: string;

  constructor(o: Product) {
    Object.assign(this, o);
  }
}

export class ProductLimits {
  @Prop() price: number;
  @Prop() quantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
