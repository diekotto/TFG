import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { JwtGuard } from '../guards/roles/jwt.guard';
import { RolesGuard } from '../guards/roles/roles.guard';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ReadProductResponseDto } from './dto/read-product-response-dto';
import { Roles } from '../guards/roles/roles.decorator';
import { RoleName } from '../../db/role-mongo/role-schema';
import { CreateProductResponseDto } from './dto/create-product-response-dto';

@ApiTags('Products')
@Controller('product')
@UseGuards(JwtGuard, RolesGuard)
@ApiBadRequestResponse({
  description: 'There are params error',
})
@ApiNotFoundResponse({
  description: 'Entity not found',
})
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  @Roles()
  readAll(): Promise<ReadProductResponseDto[]> {
    return this.productService.readAll();
  }

  @Get('/:id')
  @Roles()
  readById(@Param('id') id: string): Promise<any> {
    return this.productService.readById(id);
  }

  @Get('/ean/:ean')
  @Roles(RoleName.ALMACEN)
  readByEan(@Param('ean') ean: string): Promise<any> {
    return this.productService.readByEan(ean);
  }

  @Post('/')
  @Roles(RoleName.ALMACEN)
  create(
    @Body() body: CreateProductResponseDto,
  ): Promise<ReadProductResponseDto> {
    return this.productService.create(new CreateProductResponseDto(body));
  }

  @Put('/:id')
  @Roles(RoleName.ALMACEN)
  updateProduct(
    @Param('id') id: string,
    @Body() body: CreateProductResponseDto,
  ): Promise<ReadProductResponseDto> {
    return this.productService.updateById(
      id,
      new CreateProductResponseDto(body),
    );
  }

  @Delete('/:id')
  @Roles(RoleName.ALMACEN)
  @ApiAcceptedResponse()
  deleteProduct(@Param('id') ean: string): Promise<void> {
    return this.productService.deleteById(ean);
  }
}
