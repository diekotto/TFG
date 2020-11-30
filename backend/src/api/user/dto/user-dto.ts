import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { RoleName } from '../../../db/role-mongo/role-schema';

export class UserActionDto {
  @ApiProperty({
    format: 'ISO String',
  })
  date: string;
  @ApiProperty() action: string;
}

export class UserCommentDto {
  @ApiProperty() author: string;
  @ApiProperty() comment: string;
}

export class UserDto {
  @ApiProperty({
    description: 'Id from mongodb',
    required: false,
  })
  id?: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty() password: string;
  @ApiProperty() active: boolean;
  @ApiProperty({ required: false }) actionsHistory: UserActionDto[];
  @ApiProperty({ required: false }) comments: UserCommentDto[];
  @ApiProperty({ format: 'HH:ii', required: false }) checkIn?: string;
  @ApiProperty({ format: 'HH:ii', required: false }) checkOut?: string;
  @ApiProperty({
    enum: RoleName,
  })
  permissions: RoleName[];
  @ApiProperty({
    format: 'ISO String',
    required: false,
  })
  accessHistory: string[];

  constructor(o: Partial<UserDto>) {
    // PARA LA FUNCIONALIDAD DE BORRAR COMENTARIOS
    // REVISA LA NECESIDAD DE AÑADIR ID A CADA COMENTARIO
    Object.assign(this, o);
    this.validateId();
    this.validateString('name');
    this.validateString('email');
    this.validateHoursFormat('checkIn');
    this.validateHoursFormat('checkOut');
    this.validateBoolean('active');
  }

  private validateId(): void {
    if (this.id && (typeof this.id !== 'string' || this.id.length < 1))
      throw new BadRequestException('User id bad format');
  }

  private validateString(key: string): void {
    if (typeof this[key] !== 'string' || this[key].length < 1)
      throw new BadRequestException(`User ${key} bad format`);
  }

  private validateHoursFormat(key: string): void {
    if (!this[key]) return;
    this.validateString(key);
    const regex = /^(..):(..)$/;
    const group = regex.exec(this[key]);
    if (+group[1] < 0 || +group[1] > 23)
      throw new BadRequestException(`Bad ${key} hours format`);
    if (+group[2] < 0 || +group[2] > 59)
      throw new BadRequestException(`Bad ${key} minutes format`);
  }

  private validateBoolean(key: string): void {
    if (this[key] === undefined)
      throw new BadRequestException(`User ${key} bad value`);
  }
}
