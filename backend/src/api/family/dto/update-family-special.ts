import { ApiProperty } from '@nestjs/swagger';

export class UpdateFamilySpecial {
  @ApiProperty() isSpecial: boolean;

  constructor(o: UpdateFamilySpecial) {
    o.isSpecial = !!o.isSpecial;
    Object.assign(this, o);
  }
}
