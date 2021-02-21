import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

export class UpdateFamilyMembersDto {
  @ApiProperty() quantity: number;

  constructor(o: UpdateFamilyMembersDto) {
    if (isNaN(o.quantity)) throw new BadRequestException('Quantity is needed');
    if (!o.quantity) o.quantity = 0;
    Object.assign(this, o);
  }
}
