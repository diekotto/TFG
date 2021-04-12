import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderMongoService } from '../../db/order-mongo/order-mongo.service';
import { Order, OrderDocument } from '../../db/order-mongo/order-schema';
import { uid } from 'uid';

@Injectable()
export class InvoiceService {
  constructor(private mongo: OrderMongoService) {}

  async create(input: Order): Promise<any> {
    input.createdAt = new Date();
    input.updatedAt = new Date();
    input.code = uid(7).toUpperCase();
    input.charged = false;
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
}
