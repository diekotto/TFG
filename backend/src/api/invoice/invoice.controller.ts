import {
  Body,
  Controller,
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
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { InvoiceService, ResolveInvoiceAction } from './invoice.service';
import { Order, OrderDocument } from '../../db/order-mongo/order-schema';
import { Roles } from '../guards/roles/roles.decorator';
import { RoleName } from '../../db/role-mongo/role-schema';
import { Jwt } from '../custom-decorators/jwtParamDecorator';
import { JWToken } from '../guards/jwtoken.interface';

@ApiTags('Invoices')
@Controller('invoice')
@UseGuards(JwtGuard, RolesGuard)
@ApiBadRequestResponse({
  description: 'There are params error',
})
@ApiNotFoundResponse({
  description: 'Entity not found',
})
export class InvoiceController {
  constructor(private service: InvoiceService) {}

  @Get('/today')
  @Roles(RoleName.CAJA, RoleName.RECEPCION, RoleName.ALMACEN)
  readToday(): Promise<OrderDocument[]> {
    return this.service.readToday();
  }

  @Get('/from/:from/to/:to')
  @Roles(RoleName.CAJA, RoleName.RECEPCION)
  readDateRange(
    @Param('from') from: string,
    @Param('to') to: string,
  ): Promise<OrderDocument[]> {
    return this.service.readDateRange(+from, +to);
  }

  @Get('/:id')
  @Roles(RoleName.CAJA, RoleName.RECEPCION, RoleName.ALMACEN)
  readById(@Param('id') id: string): Promise<OrderDocument> {
    return this.service.readById(id);
  }

  @Get('/credential/:credential/expedient/:expedient')
  @Roles(RoleName.CAJA, RoleName.RECEPCION)
  getFamilyCurrentMonth(
    @Param('credential') credential: string,
    @Param('expedient') expedient: string,
  ): Promise<OrderDocument[]> {
    return this.service.readFamilyCurrentMonth(credential, expedient);
  }

  @Post('/')
  @Roles(RoleName.CAJA, RoleName.RECEPCION)
  async create(
    @Body() body: Order,
    @Jwt() jwt: JWToken,
  ): Promise<OrderDocument> {
    return this.service.create(body, jwt);
  }

  @Put('/:id/pay')
  @Roles(RoleName.CAJA)
  @ApiNoContentResponse()
  payInvoice(@Param('id') id: string, @Jwt() jwt: JWToken): Promise<void> {
    return this.service.resolveInvoice(id, ResolveInvoiceAction.PAY, jwt);
  }

  @Put('/:id/close')
  @Roles(RoleName.CAJA)
  @ApiNoContentResponse()
  closeInvoice(@Param('id') id: string, @Jwt() jwt: JWToken): Promise<void> {
    return this.service.resolveInvoice(id, ResolveInvoiceAction.CLOSE, jwt);
  }
}
