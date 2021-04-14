import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { OrderMongoService } from '../../db/order-mongo/order-mongo.service';
import { Order, OrderDocument } from '../../db/order-mongo/order-schema';
import { uid } from 'uid';
import { WebsocketsService } from '../../websockets/websockets.service';

@Injectable()
export class InvoiceService {
  constructor(
    private mongo: OrderMongoService,
    private wsService: WebsocketsService,
  ) {}

  async create(input: Order): Promise<any> {
    input.createdAt = new Date();
    input.updatedAt = new Date();
    input.code = uid(7).toUpperCase();
    input.paid = false;
    input.deleted = false;
    const order: OrderDocument = await this.mongo.create(input);
    return order.toObject();
  }

  async readById(id: string): Promise<OrderDocument> {
    const order: OrderDocument = await this.mongo.findById(id);
    if (!order) throw new NotFoundException(`Invoice with id ${id} not found`);
    return order.toObject();
  }

  async readFamilyCurrentMonth(
    credential: string,
    expedient: string,
  ): Promise<OrderDocument[]> {
    const currentMont: Date = new Date();
    currentMont.setDate(1);
    currentMont.setHours(0);
    currentMont.setMinutes(0);
    currentMont.setMilliseconds(0);
    const nextMont: Date = new Date();
    nextMont.setMonth(currentMont.getMonth() + 1);
    nextMont.setDate(1);
    nextMont.setHours(0);
    nextMont.setMinutes(0);
    nextMont.setMilliseconds(0);
    const filter = {
      $or: [{ credential }, { expedient }],
      createdAt: {
        $gte: currentMont,
        $lte: nextMont,
      },
    };
    return (await this.mongo.findByConditions(filter)).map((o: OrderDocument) =>
      o.toObject(),
    );
  }

  async resolveInvoice(
    id: string,
    action: ResolveInvoiceAction,
  ): Promise<void> {
    const order: OrderDocument = await this.mongo.findById(id);
    if (!order) throw new NotFoundException(`Invoice with id ${id} not found`);
    if (order.paid || order.deleted) {
      throw new PreconditionFailedException('This invoice is already resolved');
    }
    switch (action) {
      case ResolveInvoiceAction.CLOSE:
        order.deleted = true;
        break;
      case ResolveInvoiceAction.PAY:
        order.paid = true;
        break;
      default:
        throw new InternalServerErrorException(
          'Action against invoice not implemented',
        );
    }
    this.broadcastInvoiceResolved(id, action);
    order.updatedAt = new Date();
    await order.save();
  }

  private broadcastInvoiceResolved(
    invoiceId: string,
    action: ResolveInvoiceAction,
  ): void {
    this.wsService.broadcastInvoice({
      invoiceId,
      action,
    });
  }
}

export enum ResolveInvoiceAction {
  CLOSE,
  PAY,
}
