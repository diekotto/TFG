import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

export class CreateFamilyDto {
  @ApiProperty() dni: string;
  @ApiProperty() familyMembers: number;
  @ApiProperty() special: boolean;

  constructor(o: CreateFamilyDto) {
    if (!o.dni) throw new BadRequestException('ID is needed');
    if (!o.familyMembers) o.familyMembers = 0;
    o.special = !!o.special;
    Object.assign(this, o);
  }
}
