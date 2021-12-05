import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 } from 'uuid';

export type ParishDocument = Parish & Document;

@Schema()
export class Parish {
  @Prop({ default: v4, index: true }) parishId?: string;
  @Prop() name: string;
  @Prop() code: string;
  @Prop() description: string;
  @Prop({ default: true }) active?: boolean;
}

export const ParishSchema = SchemaFactory.createForClass(Parish);
