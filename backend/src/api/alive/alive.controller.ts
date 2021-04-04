import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';

class AliveResponseDto {
  @ApiProperty()
  ok: boolean;

  constructor(value = true) {
    this.ok = !!value;
  }
}

@ApiTags('Alive')
@Controller('alive')
export class AliveController {
  @Get('/')
  @ApiOkResponse({
    type: AliveResponseDto,
  })
  alive(): AliveResponseDto {
    return new AliveResponseDto();
  }
}
