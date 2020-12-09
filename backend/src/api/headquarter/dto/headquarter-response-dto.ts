import { ApiProperty } from '@nestjs/swagger';
import { HeadquarterDocument } from '../../../db/headquarter-mongo/headquarter-schema';

export class HeadquarterResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiProperty() address: string;
  @ApiProperty() postalCode: string;
  @ApiProperty() province: string;
  @ApiProperty() city: string;

  constructor(o: HeadquarterResponseDto) {
    Object.assign(this, o);
  }

  static fromHeadquarterDocument(
    o: HeadquarterDocument,
  ): HeadquarterResponseDto {
    return new HeadquarterResponseDto({
      id: o.id,
      name: o.name,
      description: o.description,
      address: o.address,
      postalCode: o.postalCode,
      province: o.province,
      city: o.province,
    });
  }
}
