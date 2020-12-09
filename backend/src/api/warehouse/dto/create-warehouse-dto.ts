import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

export class CreateWarehouseDto {
  @ApiProperty() headquarter: string;

  constructor(o: CreateWarehouseDto) {
    if (!o.headquarter || typeof o.headquarter !== 'string')
      throw new BadRequestException('Headquarter id is needed');
    this.headquarter = o.headquarter;
  }
}
