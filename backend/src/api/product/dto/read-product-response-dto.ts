import { ApiProperty } from '@nestjs/swagger';
import { ProductDocument } from '../../../db/product-mongo/product-schema';

export class ReadProductResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() quantity: string;
  @ApiProperty() category: string;
  @ApiProperty() ingredients: string;
  @ApiProperty() allergens: string;
  @ApiProperty() labels: string;
  @ApiProperty() imageUrl: string;

  constructor(o: ReadProductResponseDto) {
    Object.assign(this, o);
  }

  static fromProductDocument(o: ProductDocument): ReadProductResponseDto {
    return new ReadProductResponseDto(o.toObject());
  }
}
