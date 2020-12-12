import {
  BadRequestException,
  Body,
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
import { AddProductDto } from './dto/add-product-dto';
import { RetrieveProductDto } from './dto/retrieve-product.dto';
import { BlockProductDto } from './dto/block-product-dto';
import { UpdateProductPreferenceDto } from './dto/update-product-preference-dto';

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

  @Put('/:id/add-product')
  @Roles(RoleName.ADMINLOCAL)
  addProduct(
    @Param('id') id: string,
    @Body() body: AddProductDto,
  ): Promise<WarehouseResponseDto> {
    if (typeof id !== 'string') throw new BadRequestException('Bad id');
    const input = new AddProductDto(body);
    return this.service.addProduct(id, input);
  }

  @Put('/:id/retrieve-product')
  @Roles(RoleName.ADMINLOCAL)
  retrieveProduct(
    @Param('id') id: string,
    @Body() body: RetrieveProductDto,
  ): Promise<WarehouseResponseDto> {
    if (typeof id !== 'string') throw new BadRequestException('Bad id');
    const input = new RetrieveProductDto(body);
    return this.service.retrieveProduct(id, input);
  }

  @Put('/:id/block-product')
  @Roles(RoleName.ADMINLOCAL)
  blockProduct(
    @Param('id') id: string,
    @Body() body: BlockProductDto,
  ): Promise<WarehouseResponseDto> {
    if (typeof id !== 'string') throw new BadRequestException('Bad id');
    const input = new BlockProductDto(body);
    return this.service.setBlockedProduct(id, input, true);
  }

  @Put('/:id/unblock-product')
  @Roles(RoleName.ADMINLOCAL)
  unblockProduct(
    @Param('id') id: string,
    @Body() body: BlockProductDto,
  ): Promise<WarehouseResponseDto> {
    if (typeof id !== 'string') throw new BadRequestException('Bad id');
    const input = new BlockProductDto(body);
    return this.service.setBlockedProduct(id, input, false);
  }
  @Put('/:id/preference-product')
  @Roles(RoleName.ADMINLOCAL)
  updateProductPreference(
    @Param('id') id: string,
    @Body() body: UpdateProductPreferenceDto,
  ): Promise<WarehouseResponseDto> {
    if (typeof id !== 'string') throw new BadRequestException('Bad id');
    const input = new UpdateProductPreferenceDto(body);
    return this.service.updateProductPreference(id, input);
  }

  @Delete('/:id')
  @ApiNoContentResponse()
  @Roles(RoleName.ADMINLOCAL)
  delete(@Param('id') id: string): Promise<void> {
    if (typeof id !== 'string') throw new BadRequestException('Bad id');
    return this.service.delete(id);
  }
}
