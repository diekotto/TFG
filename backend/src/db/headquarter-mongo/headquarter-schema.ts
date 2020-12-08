import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type HeadquarterDocument = Headquarter & Document;

@Schema()
export class Headquarter {
  @Prop() name: string;
  @Prop() description: string;
  @Prop() address: string;
  @Prop() postalCode: string;
  @Prop() province: string;
  @Prop() city: string;

  constructor(o: Headquarter) {
    Object.assign(this, o);
  }
}

export const HeadquarterSchema = SchemaFactory.createForClass(Headquarter);
