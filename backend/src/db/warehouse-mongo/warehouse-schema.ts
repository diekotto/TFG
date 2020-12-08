import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WarehouseDocument = Warehouse & Document;

@Schema()
export class Warehouse {
  @Prop() headquarter: string;
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);
