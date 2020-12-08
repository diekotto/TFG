import { ApiProperty } from '@nestjs/swagger';
import { WarehouseDocument } from '../../../db/warehouse-mongo/warehouse-schema';

export class WarehouseResponseDto {
  @ApiProperty() headquarter: string;

  constructor(o: WarehouseResponseDto) {
    Object.assign(this, o);
  }

  static fromWarehouseDocument(o: WarehouseDocument): WarehouseResponseDto {
    return new WarehouseResponseDto({
      headquarter: o.headquarter,
    });
  }
}
