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

  @Get('/:id')
  @Roles(RoleName.RECEPCION)
  readById(@Param('id') id: string): Promise<OrderDocument> {
    return this.service.readById(id);
  }

  @Get('/credential/:credential/expedient/:expedient')
  @Roles(RoleName.RECEPCION)
  getFamilyCurrentMonth(
    @Param('credential') credential: string,
    @Param('expedient') expedient: string,
  ): Promise<OrderDocument[]> {
    return this.service.readFamilyCurrentMonth(credential, expedient);
  }

  @Post('/')
  @Roles(RoleName.RECEPCION, RoleName.CAJA)
  create(@Body() body: Order): Promise<OrderDocument> {
    return this.service.create(body);
  }

  @Put('/:id/pay')
  @Roles(RoleName.CAJA)
  @ApiNoContentResponse()
  payInvoice(@Param('id') id: string): Promise<void> {
    return this.service.resolveInvoice(id, ResolveInvoiceAction.PAY);
  }

  @Put('/:id/close')
  @Roles(RoleName.CAJA)
  @ApiNoContentResponse()
  closeInvoice(@Param('id') id: string): Promise<void> {
    return this.service.resolveInvoice(id, ResolveInvoiceAction.CLOSE);
  }
}
