import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { WarehouseProductPreference } from '../../../db/warehouse-mongo/warehouse-schema';

export class UpdateProductPreferenceDto {
  @ApiProperty({
    description: 'foreign id of product collection',
  })
  product: string;
  @ApiProperty({
    enum: WarehouseProductPreference,
  })
  preference: WarehouseProductPreference;

  constructor(o: UpdateProductPreferenceDto) {
    if (!o.product || !o.preference)
      throw new BadRequestException('Bad params');
    UpdateProductPreferenceDto.validatePreference(o.preference);
    this.product = o.product;
    this.preference = o.preference;
  }

  static validatePreference(input: number): void {
    if (
      isNaN(input) ||
      input < WarehouseProductPreference.LOW ||
      input > WarehouseProductPreference.HIGH
    )
      throw new BadRequestException('Bad preference value');
  }
}
