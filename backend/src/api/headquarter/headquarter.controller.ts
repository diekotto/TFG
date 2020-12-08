import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../guards/roles/jwt.guard';
import { RolesGuard } from '../guards/roles/roles.guard';
import { ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { HeadquarterService } from './headquarter.service';
import { Roles } from '../guards/roles/roles.decorator';
import { HeadquarterResponseDto } from './dto/headquarter-response-dto';
import { HeadquarterDto } from './dto/headquarter-dto';
import { RoleName } from '../../db/role-mongo/role-schema';

@ApiTags('Headquarter')
@Controller('headquarter')
@UseGuards(JwtGuard, RolesGuard)
@ApiBadRequestResponse({
  description: 'There are params error',
})
@ApiNotFoundResponse({
  description: 'Entity not found',
})
export class HeadquarterController {
  constructor(private service: HeadquarterService) {}

  @Get('/')
  @Roles()
  async readAll(): Promise<HeadquarterResponseDto[]> {
    return this.service.readAll();
  }

  @Get('/:name')
  @Roles()
  async readByName(
    @Param('name') name: string,
  ): Promise<HeadquarterResponseDto> {
    if (typeof name !== 'string') throw new BadRequestException('Bad param');
    return this.service.readByName(name);
  }

  @Post('/')
  @Roles(RoleName.ADMIN)
  async create(@Body() body: HeadquarterDto): Promise<HeadquarterResponseDto> {
    const input = HeadquarterDto.fromAny(body);
    return this.service.create(input);
  }

  @Put('/:id')
  @Roles(RoleName.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() body: HeadquarterDto,
  ): Promise<HeadquarterResponseDto> {
    if (id !== body.id) throw new ConflictException('Bad ids');
    if (!body.id || typeof body.id !== 'string')
      throw new BadRequestException('Body needs id');
    const input = HeadquarterDto.fromAny(body);
    return this.service.update(input);
  }

  @Delete('/:id')
  @Roles(RoleName.ADMIN)
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
