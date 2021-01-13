import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FamilyDocument = Family & Document;

@Schema()
export class Family {
  @Prop() hashId: string;
  @Prop() familyMembers: number;
  @Prop() special: boolean;
  @Prop() createdAt: Date;
}

export const FamilySchema = SchemaFactory.createForClass(Family);
