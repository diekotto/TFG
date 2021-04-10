import { ApiProperty } from '@nestjs/swagger';
import { ProductLimits } from '../../../db/product-mongo/product-schema';

export class CreateProductResponseDto {
  @ApiProperty() ean: string;
  @ApiProperty() alias: string;
  @ApiProperty() limits: ProductLimits[];
  @ApiProperty() pvp: number;
  @ApiProperty() code: string; // Inner code for every warehouse

  constructor(o: CreateProductResponseDto) {
    Object.assign(this, o);
  }
}
