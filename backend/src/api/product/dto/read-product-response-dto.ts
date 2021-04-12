import { ApiProperty } from '@nestjs/swagger';
import {
  ProductDocument,
  ProductLimits,
} from '../../../db/product-mongo/product-schema';

export class ReadProductResponseDto {
  @ApiProperty() _id: string;
  @ApiProperty() name: string;
  @ApiProperty() alias: string;
  @ApiProperty() ean: string;
  @ApiProperty() quantity: string;
  @ApiProperty() category: string;
  @ApiProperty() ingredients: string;
  @ApiProperty() allergens: string;
  @ApiProperty() labels: string;
  @ApiProperty() imageUrl: string;
  @ApiProperty() limits: ProductLimits[];
  @ApiProperty() pvp: number;
  @ApiProperty() code: string; // Inner code for every warehouse
  @ApiProperty() type: string;
  @ApiProperty() chargeableOutBudget: boolean;
  @ApiProperty() warehouse: string;

  constructor(o: ReadProductResponseDto) {
    Object.assign(this, o);
  }

  static fromProductDocument(o: ProductDocument): ReadProductResponseDto {
    return new ReadProductResponseDto(o.toObject());
  }
}
