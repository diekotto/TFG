import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

export class BlockProductDto {
  @ApiProperty({
    description: 'foreign id of product collection',
  })
  product: string;

  constructor(o: BlockProductDto) {
    if (!o.product) throw new BadRequestException('Bad params');
    this.product = o.product;
  }
}
