import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty() active: boolean;
  @ApiProperty() actionsHistory: UserActionDto[];
  @ApiProperty() comments: UserCommentDto[];
  // permissions: string[]; // TODO: SIN HACER #9
  @ApiProperty({
    format: 'ISO String',
  })
  accessHistory: string[];
  @ApiProperty({
    format: 'HH:ss',
  })
  checkIn: string;
  @ApiProperty({
    format: 'HH:ss',
  })
  checkOut: string;

  constructor(o?: UserDto) {
    Object.assign(this, o);
  }
}
