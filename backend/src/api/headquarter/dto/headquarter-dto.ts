import { ApiProperty } from '@nestjs/swagger';

export class HeadquarterDto {
  @ApiProperty() id?: string;
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiProperty() address: string;
  @ApiProperty() postalCode: string;
  @ApiProperty() province: string;
  @ApiProperty() city: string;

  constructor(o: HeadquarterDto) {
    Object.assign(this, o);
  }

  static fromAny(o: any): HeadquarterDto {
    return new HeadquarterDto({
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
