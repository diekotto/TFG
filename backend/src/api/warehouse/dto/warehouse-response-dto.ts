import { ApiProperty } from '@nestjs/swagger';
import {
  WarehouseDocument,
  WarehouseMetadata,
  WarehouseProduct,
  WarehouseProductPreference,
} from '../../../db/warehouse-mongo/warehouse-schema';

export class WarehouseMetadataDto {
  @ApiProperty() id: string;
  @ApiProperty() product: string;
  @ApiProperty() preference: WarehouseProductPreference;
  @ApiProperty() stock: number;
  @ApiProperty() blocked: boolean;
}

export class WarehouseProductDto {
  @ApiProperty() id: string;
  @ApiProperty() product: string;
  @ApiProperty({
    format: 'ISO String',
  })
  expiry: string;

  constructor(o: WarehouseProductDto) {
    this.id = o.id;
    this.product = o.product;
    this.expiry = o.expiry;
  }
}

export class WarehouseResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() headquarter: string;
  @ApiProperty() name: string;
  @ApiProperty() products: WarehouseProductDto[];
  @ApiProperty() metadata: WarehouseMetadataDto[];

  constructor(o: WarehouseResponseDto) {
    Object.assign(this, o);
  }

  static fromWarehouseDocument(o: WarehouseDocument): WarehouseResponseDto {
    return new WarehouseResponseDto({
      id: o.id,
      headquarter: o.headquarter,
      name: o.name,
      products: o.products.map((p: WarehouseProduct) => ({
        id: p.id,
        expiry: p.expiry.toISOString(),
        product: p.product,
      })),
      metadata: o.metadata.map((m: WarehouseMetadata) => ({
        id: m.id,
        product: m.product,
        preference: m.preference,
        stock: m.stock,
        blocked: m.blocked,
      })),
    });
  }
}
