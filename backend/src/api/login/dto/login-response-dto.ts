import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user-dto';

export class LoginResponseDto {
  @ApiProperty() user: UserDto;
  @ApiProperty() jwt: string;

  constructor(o: LoginResponseDto) {
    Object.assign(this, o);
  }
}
