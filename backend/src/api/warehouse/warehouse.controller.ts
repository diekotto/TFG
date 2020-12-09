import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../guards/roles/jwt.guard';
import { RolesGuard } from '../guards/roles/roles.guard';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { Roles } from '../guards/roles/roles.decorator';
import { WarehouseResponseDto } from './dto/warehouse-response-dto';
import { WarehouseService } from './warehouse.service';
import { RoleName } from '../../db/role-mongo/role-schema';
import { CreateWarehouseDto } from './dto/create-warehouse-dto';

@ApiTags('Warehouse')
@Controller('warehouse')
@UseGuards(JwtGuard, RolesGuard)
@ApiBadRequestResponse({
  description: 'There are params error',
})
@ApiNotFoundResponse({
  description: 'Entity not found',
})
export class WarehouseController {
  constructor(private service: WarehouseService) {}

  @Get('/')
  @Roles()
  readAll(): Promise<WarehouseResponseDto[]> {
    return this.service.readAll();
  }

  @Get('/:id')
  @Roles()
  readById(@Param('id') id: string): Promise<WarehouseResponseDto> {
    if (typeof id !== 'string') throw new BadRequestException('Bad id');
    return this.service.readById(id);
  }

  @Get('/headquarter/:id')
  @Roles()
  readAllByHeadquarter(
    @Param('id') id: string,
  ): Promise<WarehouseResponseDto[]> {
    if (typeof id !== 'string') throw new BadRequestException('Bad id');
    return this.service.readAllByHeadquarter(id);
  }

  @Post('/')
  @Roles(RoleName.ADMINLOCAL)
  create(@Body() body: CreateWarehouseDto): Promise<WarehouseResponseDto> {
    const input: CreateWarehouseDto = new CreateWarehouseDto(body);
    return this.service.create(input);
  }

  @Delete('/:id')
  @ApiNoContentResponse()
  @Roles(RoleName.ADMINLOCAL)
  delete(@Param('id') id: string): Promise<void> {
    if (typeof id !== 'string') throw new BadRequestException('Bad id');
    return this.service.delete(id);
  }
}
