import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WarehouseDocument = Warehouse & Document;

export enum WarehouseProductPreference {
  LOW,
  MEDIUM,
  HIGH,
}

export class WarehouseMetadata {
  @Prop() id: string; // UID
  @Prop() product: string;
  @Prop() preference: WarehouseProductPreference;
  @Prop() stock: number;
  @Prop() blocked: boolean;
}

export class WarehouseProduct {
  @Prop() id: string; // UID
  @Prop() product: string; // Product document id
  @Prop() expiry: Date;
}

@Schema()
export class Warehouse {
  @Prop() headquarter: string;
  @Prop() name: string;
  @Prop() products: WarehouseProduct[];
  @Prop() metadata: WarehouseMetadata[];
  @Prop() createdAt: Date;
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);
