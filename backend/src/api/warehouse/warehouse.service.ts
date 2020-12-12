import { Injectable, NotFoundException } from '@nestjs/common';
import { WarehouseMongoService } from '../../db/warehouse-mongo/warehouse-mongo.service';
import { WarehouseResponseDto } from './dto/warehouse-response-dto';
import {
  Warehouse,
  WarehouseDocument,
  WarehouseMetadata,
  WarehouseProduct,
  WarehouseProductPreference,
} from '../../db/warehouse-mongo/warehouse-schema';
import { CreateWarehouseDto } from './dto/create-warehouse-dto';
import { ObjectId } from 'mongodb';
import { AddProductDto } from './dto/add-product-dto';
import * as moment from 'moment';
import { RetrieveProductDto } from './dto/retrieve-product.dto';
import { uid } from 'uid';
import { BlockProductDto } from './dto/block-product-dto';
import { UpdateProductPreferenceDto } from './dto/update-product-preference-dto';

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

  async addProduct(
    id: string,
    input: AddProductDto,
  ): Promise<WarehouseResponseDto> {
    const warehouse: WarehouseDocument = await this.warehouseMongo.findById(id);
    if (!warehouse) throw new NotFoundException(`Warehouse ${id} not found`);
    const metadataPos = warehouse.metadata.findIndex(
      (p: WarehouseMetadata) => p.product === input.product,
    );
    if (metadataPos >= 0) warehouse.metadata[metadataPos].stock += 1;
    else
      warehouse.metadata.push({
        id: uid(),
        product: input.product,
        stock: 1,
        preference: WarehouseProductPreference.MEDIUM,
        blocked: false,
      });
    warehouse.products.push({
      id: uid(),
      product: input.product,
      expiry: moment(input.expiry, 'YYYY-MM-DD').toDate(),
    });
    warehouse.markModified('metadata');
    await warehouse.save();
    return WarehouseResponseDto.fromWarehouseDocument(warehouse);
  }

  async retrieveProduct(
    id: string,
    input: RetrieveProductDto,
  ): Promise<WarehouseResponseDto> {
    const warehouse: WarehouseDocument = await this.warehouseMongo.findById(id);
    if (!warehouse) throw new NotFoundException(`Warehouse ${id} not found`);
    const metadataPos = warehouse.metadata.findIndex(
      (p: WarehouseMetadata) => p.product === input.product,
    );
    if (metadataPos < 0) {
      throw new NotFoundException('Product is not in the warehouse.metadata');
    }
    const productPos = warehouse.products.findIndex(
      (p: WarehouseProduct) => p.id === input.idProduct,
    );
    if (productPos < 0) {
      throw new NotFoundException('Product is not in the warehouse.products');
    }
    warehouse.metadata[metadataPos].stock -= 1;
    if (warehouse.metadata[metadataPos].stock < 1) {
      warehouse.metadata.splice(metadataPos, 1);
    }
    warehouse.products.splice(productPos, 1);
    warehouse.markModified('metadata');
    await warehouse.save();
    return WarehouseResponseDto.fromWarehouseDocument(warehouse);
  }

  async setBlockedProduct(
    id: string,
    input: BlockProductDto,
    blocked: boolean,
  ): Promise<WarehouseResponseDto> {
    const warehouse: WarehouseDocument = await this.warehouseMongo.findById(id);
    if (!warehouse) throw new NotFoundException(`Warehouse ${id} not found`);
    const metadataPos = warehouse.metadata.findIndex(
      (p: WarehouseMetadata) => p.product === input.product,
    );
    if (metadataPos < 0) {
      throw new NotFoundException('Product is not in the warehouse.metadata');
    }
    warehouse.metadata[metadataPos].blocked = blocked;
    warehouse.markModified('metadata');
    await warehouse.save();
    return WarehouseResponseDto.fromWarehouseDocument(warehouse);
  }

  async updateProductPreference(
    id: string,
    input: UpdateProductPreferenceDto,
  ): Promise<WarehouseResponseDto> {
    const warehouse: WarehouseDocument = await this.warehouseMongo.findById(id);
    if (!warehouse) throw new NotFoundException(`Warehouse ${id} not found`);
    const metadataPos = warehouse.metadata.findIndex(
      (p: WarehouseMetadata) => p.product === input.product,
    );
    if (metadataPos < 0) {
      throw new NotFoundException('Product is not in the warehouse.metadata');
    }
    warehouse.metadata[metadataPos].preference = input.preference;
    warehouse.markModified('metadata');
    await warehouse.save();
    return WarehouseResponseDto.fromWarehouseDocument(warehouse);
  }
}
