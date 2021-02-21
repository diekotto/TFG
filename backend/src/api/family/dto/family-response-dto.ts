import { ApiProperty } from '@nestjs/swagger';
import { FamilyDocument } from '../../../db/family-mongo/family-schema';

export class FamilyResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({
    description: 'Dni hashed',
  })
  hashId: string;
  @ApiProperty() familyMembers: number;
  @ApiProperty() special: boolean;
  @ApiProperty({
    format: 'ISO String',
  })
  createdAt: string;

  constructor(o: FamilyResponseDto) {
    Object.assign(this, o);
  }

  static fromFamilyDocument(f: FamilyDocument): FamilyResponseDto {
    return new FamilyResponseDto({
      id: f.id,
      hashId: f.hashId,
      familyMembers: f.familyMembers,
      special: f.special,
      createdAt: f.createdAt.toISOString(),
    });
  }
}
