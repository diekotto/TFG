import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

export class RetrieveProductDto {
  @ApiProperty({
    description: 'Foreign id of product collection',
  })
  product: string;
  @ApiProperty({
    description: 'Inner id for warehouse.products element',
  })
  idProduct: string;

  constructor(o: RetrieveProductDto) {
    if (!o.idProduct || !o.product) throw new BadRequestException('Bad params');
    this.idProduct = o.idProduct;
    this.product = o.product;
  }
}
