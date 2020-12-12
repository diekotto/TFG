import { ApiProperty } from '@nestjs/swagger';
import {
  WarehouseDocument,
  WarehouseMetadata,
  WarehouseProduct,
  WarehouseProductPriority,
} from '../../../db/warehouse-mongo/warehouse-schema';

export class WarehouseMetadataDto {
  @ApiProperty() id: string;
  @ApiProperty() product: string;
  @ApiProperty() priority: WarehouseProductPriority;
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
}

export class WarehouseResponseDto {
  @ApiProperty() id: string;
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
        id: p.id,
        expiry: p.expiry.toISOString(),
        product: p.product,
      })),
      metadata: o.metadata.map((m: WarehouseMetadata) => ({
        id: m.id,
        product: m.product,
        priority: m.priority,
        stock: m.stock,
        blocked: m.blocked,
      })),
    });
  }
}
