import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

export class ReadFilterDto {
  @ApiProperty() key: string;
  @ApiProperty() value: string;

  constructor(o: ReadFilterDto) {
    if (!o.key || !o.value)
      throw new BadRequestException('Needs key and value');
    Object.assign(this, o);
  }
}
