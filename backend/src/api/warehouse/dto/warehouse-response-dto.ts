import { ApiProperty } from '@nestjs/swagger';
import {
  WarehouseDocument,
  WarehouseMetadata,
  WarehouseProduct,
  WarehouseProductPriority,
} from '../../../db/warehouse-mongo/warehouse-schema';

export class WarehouseMetadataDto {
  @ApiProperty() product: string;
  @ApiProperty() priority: WarehouseProductPriority;
  @ApiProperty() stock: number;
}

export class WarehouseProductDto {
  @ApiProperty() product: string;
  @ApiProperty() stock: number;
  @ApiProperty({
    format: 'ISO String',
  })
  expiry: string;
}

export class WarehouseResponseDto {
  @ApiProperty() id?: string;
  @ApiProperty() headquarter: string;
  @ApiProperty() products: WarehouseProductDto[];
  @ApiProperty() metadata: WarehouseMetadataDto[];

  constructor(o: WarehouseResponseDto) {
    Object.assign(this, o);
  }

  static fromWarehouseDocument(o: WarehouseDocument): WarehouseResponseDto {
    return new WarehouseResponseDto({
      id: o.id,
      headquarter: o.headquarter,
      products: o.products.map((p: WarehouseProduct) => ({
        expiry: p.expiry.toISOString(),
        product: p.product,
        stock: p.stock,
      })),
      metadata: o.metadata.map((m: WarehouseMetadata) => ({
        product: m.product,
        priority: m.priority,
        stock: m.stock,
      })),
    });
  }
}
