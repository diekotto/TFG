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
import { JWToken } from '../guards/jwtoken.interface';
import { UserMongoService } from '../../db/user-mongo/user-mongo.service';
import { UserAction } from '../../db/user-mongo/user-schema';
import * as NodeCache from 'node-cache';

@Injectable()
export class InvoiceService {
  private cache: NodeCache;
  private ordersCacheKey = 'orders';

  constructor(
    private mongo: OrderMongoService,
    private userMongo: UserMongoService,
    private wsService: WebsocketsService,
  ) {
    this.cache = new NodeCache({
      stdTTL: 60 * 60 * 2, // 2 horas
      useClones: false,
    });
  }

  async saveUserAction(jwt: JWToken, actionTxt: string): Promise<void> {
    const user = await this.userMongo.findById(jwt.id);
    const action: UserAction = {
      date: new Date(),
      action: actionTxt,
    };
    user.actionsHistory.push(action);
    await user.save();
  }

  async create(input: Order, jwt: JWToken): Promise<any> {
    input.createdAt = new Date();
    input.updatedAt = new Date();
    input.code = `${new Date().getFullYear().toString()}-${uid(
      7,
    ).toUpperCase()}`;
    input.paid = false;
    input.deleted = false;
    input.origin = jwt.id;
    const order: OrderDocument = await this.mongo.create(input);
    this.broadcastInvoiceResolved(order.id, ResolveInvoiceAction.CREATED);
    await this.saveUserAction(
      jwt,
      `Invoice ${order.id} created by ${order.id}`,
    );
    await this.refreshCache();
    return order.toObject();
  }

  async readById(id: string): Promise<OrderDocument> {
    const order: OrderDocument = await this.mongo.findById(id);
    if (!order) throw new NotFoundException(`Invoice with id ${id} not found`);
    return order.toObject();
  }

  async readToday(): Promise<OrderDocument[]> {
    let orders: OrderDocument[] = this.cache.get(this.ordersCacheKey);
    if (orders) return orders;
    const currentDate: Date = new Date();
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setMilliseconds(0);
    const nextDate: Date = new Date();
    nextDate.setDate(currentDate.getDate() + 1);
    nextDate.setHours(0);
    nextDate.setMinutes(0);
    nextDate.setMilliseconds(0);
    const filter = {
      createdAt: {
        $gte: currentDate,
        $lte: nextDate,
      },
    };
    orders = (
      await this.mongo.findByConditions(filter)
    ).map((o: OrderDocument) => o.toObject());
    this.cache.set(this.ordersCacheKey, orders);
    return orders;
  }

  async readDateRange(from: number, to: number): Promise<OrderDocument[]> {
    const today = new Date();
    const currentDate: Date = new Date(from);
    if (
      from === to &&
      today.getDate() === currentDate.getDate() &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    ) {
      const orders: OrderDocument[] = this.cache.get(this.ordersCacheKey);
      if (orders) return orders;
      return this.refreshCache();
    }
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setMilliseconds(0);
    const nextDate: Date = new Date(to);
    nextDate.setDate(nextDate.getDate() + 1);
    nextDate.setHours(0);
    nextDate.setMinutes(0);
    nextDate.setMilliseconds(0);
    const filter = {
      createdAt: {
        $gte: currentDate,
        $lte: nextDate,
      },
    };
    return (await this.mongo.findByConditions(filter)).map((o: OrderDocument) =>
      o.toObject(),
    );
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
    jwt: JWToken,
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
    order.resolvedAt = new Date();
    order.resolver = jwt.id;
    await order.save();
    await this.saveUserAction(
      jwt,
      `Invoice ${order.id} updated by ${jwt.id} with action ${action}`,
    );
    await this.refreshCache();
  }

  async dispatchOrder(id: string, jwt: JWToken): Promise<OrderDocument> {
    const order: OrderDocument = await this.mongo.findById(id);
    if (!order) throw new NotFoundException(`Invoice with id ${id} not found`);
    if (order.dispatched) {
      throw new PreconditionFailedException(
        'This order has been dispached already',
      );
    }
    order.dispatched = true;
    order.dispatcher = jwt.id;
    order.dispatchedAt = new Date();
    order.updatedAt = new Date();
    await this.saveUserAction(jwt, `Order ${order.id} dispatched by ${jwt.id}`);
    return order;
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

  private async refreshCache(): Promise<OrderDocument[]> {
    this.cache.del(this.ordersCacheKey);
    return await this.readToday();
  }
}

export enum ResolveInvoiceAction {
  CLOSE,
  PAY,
  CREATED,
}
