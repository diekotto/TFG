import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OpenfoodDocument = Openfood & Document;

@Schema({
  strict: false,
})
export class Openfood {
  @Prop() ean: string;
  @Prop() createdAt: Date;
}

export const OpenfoodSchema = SchemaFactory.createForClass(Openfood);
