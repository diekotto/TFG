import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FamilyService } from './family.service';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { JwtGuard } from '../guards/roles/jwt.guard';
import { RolesGuard } from '../guards/roles/roles.guard';
import { ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { Roles } from '../guards/roles/roles.decorator';
import { RoleName } from '../../db/role-mongo/role-schema';
import { ReadFilterDto } from './dto/read-filter-dto';
import { CreateFamilyDto } from './dto/create-family-dto';
import { FamilyResponseDto } from './dto/family-response-dto';
import { UpdateFamilyMembersDto } from './dto/update-family-members-dto';
import { UpdateFamilySpecial } from './dto/update-family-special';

@ApiTags('Family')
@Controller('family')
@UseGuards(JwtGuard, RolesGuard)
@ApiBadRequestResponse({
  description: 'There are params error',
})
@ApiNotFoundResponse({
  description: 'Entity not found',
})
export class FamilyController {
  constructor(private service: FamilyService) {}

  @Get('/')
  @Roles(RoleName.FAMILIAR)
  async readAll(): Promise<FamilyResponseDto[]> {
    return this.service.readAll();
  }

  @Get('/filter')
  @Roles(RoleName.FAMILIAR)
  async readByFilter(
    @Param() params: ReadFilterDto,
  ): Promise<FamilyResponseDto[]> {
    return this.service.readByFilter(params);
  }

  @Post('/')
  @Roles(RoleName.FAMILIAR)
  async create(@Body() body: CreateFamilyDto): Promise<FamilyResponseDto> {
    const input = new CreateFamilyDto(body);
    return this.service.create(input);
  }

  @Put('/:dni/family-members')
  @Roles(RoleName.FAMILIAR)
  async updateFamilyMembers(
    @Param('dni') dni: string,
    @Body() body: UpdateFamilyMembersDto,
  ): Promise<FamilyResponseDto> {
    const input = new UpdateFamilyMembersDto(body);
    return this.service.updateFamilyMembers(dni, input.quantity);
  }

  @Put('/:dni/special')
  @Roles(RoleName.FAMILIAR)
  async updateSpecial(
    @Param('dni') dni: string,
    @Body() body: UpdateFamilySpecial,
  ): Promise<FamilyResponseDto> {
    const input = new UpdateFamilySpecial(body);
    return this.service.updateSpecial(dni, input.isSpecial);
  }
}
