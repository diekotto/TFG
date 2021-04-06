import { ApiProperty } from '@nestjs/swagger';

export class CreateWarehouseDto {
  @ApiProperty() headquarter: string;
  @ApiProperty() name: string;

  constructor(o: CreateWarehouseDto) {
    this.headquarter = o.headquarter;
    this.name = o.name;
  }
}
