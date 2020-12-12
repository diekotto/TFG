import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

export class AddProductDto {
  @ApiProperty({
    description: 'foreign id of product collection',
  })
  product: string;
  @ApiProperty({
    format: 'YYYY-MM-DD',
  })
  expiry: string;

  constructor(o: AddProductDto) {
    if (!o.product || !o.expiry) throw new BadRequestException('Bad params');
    this.product = o.product;
    this.expiry = o.expiry;
  }
}
