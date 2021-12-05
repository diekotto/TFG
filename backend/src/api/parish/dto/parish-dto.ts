import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ParishDocument } from '../../../db/parish-mongo/parish-schema';

export class ParishDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id?: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsBoolean()
  @ApiProperty()
  active: boolean;

  constructor(parish?: ParishDto) {
    if (parish) {
      this.id = parish.id;
      this.name = parish.name;
      this.code = parish.code;
      this.description = parish.description;
      this.active = parish.active;
    }
  }

  static fromDocument(parish: ParishDocument): ParishDto {
    return new ParishDto({
      id: parish.parishId,
      name: parish.name,
      code: parish.code,
      description: parish.description,
      active: !!parish.active,
    });
  }
}
