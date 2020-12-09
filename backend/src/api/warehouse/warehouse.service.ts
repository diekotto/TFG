import { Injectable, NotFoundException } from '@nestjs/common';
import { WarehouseMongoService } from '../../db/warehouse-mongo/warehouse-mongo.service';
import { WarehouseResponseDto } from './dto/warehouse-response-dto';
import {
  Warehouse,
  WarehouseDocument,
} from '../../db/warehouse-mongo/warehouse-schema';
import { CreateWarehouseDto } from './dto/create-warehouse-dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class WarehouseService {
  constructor(private warehouseMongo: WarehouseMongoService) {}

  async readAll(): Promise<WarehouseResponseDto[]> {
    return (await this.warehouseMongo.findAll()).map((o: WarehouseDocument) =>
      WarehouseResponseDto.fromWarehouseDocument(o),
    );
  }

  async readById(id: string): Promise<WarehouseResponseDto> {
    const warehouse: WarehouseDocument = await this.warehouseMongo.findById(id);
    if (!warehouse)
      throw new NotFoundException(`Warehouse with id ${id} not found`);
    return WarehouseResponseDto.fromWarehouseDocument(warehouse);
  }

  async readAllByHeadquarter(
    idHeadquarter: string,
  ): Promise<WarehouseResponseDto[]> {
    return (
      await this.warehouseMongo.readAllByHeadquarterId(idHeadquarter)
    ).map((o) => WarehouseResponseDto.fromWarehouseDocument(o));
  }

  async create(input: CreateWarehouseDto): Promise<WarehouseResponseDto> {
    // TODO: PREGUNTAR A LA SEDE SI EXISTE
    const schema: Warehouse = {
      headquarter: input.headquarter,
    } as Warehouse;
    const warehouseDocument = await this.warehouseMongo.create(schema);
    return WarehouseResponseDto.fromWarehouseDocument(warehouseDocument);
  }

  async delete(id: string): Promise<void> {
    await this.warehouseMongo.deleteOneByConditions({
      _id: new ObjectId(id),
    });
  }
}
