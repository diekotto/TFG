import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

export class LoginDto {
  @ApiProperty() email: string;
  @ApiProperty() password: string;

  constructor(o: LoginDto) {
    if (!o.email || !o.password) throw new BadRequestException('Params error');
    if (typeof o.email !== 'string' || typeof o.password !== 'string')
      throw new BadRequestException('Params error');
    Object.assign(this, o);
  }
}
