import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { JwtGuard } from '../guards/roles/jwt.guard';
import { RolesGuard } from '../guards/roles/roles.guard';
import { WarehouseMongoService } from '../../db/warehouse-mongo/warehouse-mongo.service';
import { warehouseProviders } from '../../db/warehouse-mongo/warehouse.providers';
import { ProvidersModule } from '../../db/providers/providers.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { Document } from 'mongoose';
import { CreateWarehouseDto } from './dto/create-warehouse-dto';
import * as moment from 'moment';
import { WarehouseResponseDto } from './dto/warehouse-response-dto';
import { WarehouseProductPreference } from '../../db/warehouse-mongo/warehouse-schema';

describe('WarehouseController (e2e)', () => {
  const uidExample = '5fb8ea418ef2703b72dc85cc';
  let controller: WarehouseController;
  let mongo: WarehouseMongoService;

  async function createWarehouse(id: string): Promise<Document> {
    const headquarter = { _id: id };
    return await mongo.create({
      headquarter: headquarter._id,
    } as any);
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        ProvidersModule,
      ],
      providers: [
        WarehouseMongoService,
        ...warehouseProviders,
        WarehouseService,
      ],
      controllers: [WarehouseController],
    })
      .overrideGuard(JwtGuard)
      .useValue({})
      .overrideGuard(RolesGuard)
      .useValue({})
      .compile();

    mongo = module.get<WarehouseMongoService>(WarehouseMongoService);
    controller = module.get<WarehouseController>(WarehouseController);
  });

  afterEach(async () => {
    await mongo.deleteManyByConditions({});
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return more than one element list', async () => {
    await createWarehouse('more than one element 1');
    await createWarehouse('more than one element 2');
    await createWarehouse('more than one element 3');
    const list = await controller.readAll();
    expect(Array.isArray(list)).toBeTruthy();
    expect(list.length).toBe(3);
  });

  it('Should return empty list', async () => {
    const list = await controller.readAll();
    expect(Array.isArray(list)).toBeTruthy();
    expect(list.length).toBe(0);
  });

  it('Should return one element', async () => {
    const doc: Document = await createWarehouse('readOneElement');
    const found = await controller.readById(doc.id);
    expect(found).toBeTruthy();
    expect(found.id).toBe(doc.id);
  });

  it('Should return 404 element not found', async () => {
    await createWarehouse('404 element not found');
    try {
      await controller.readById(uidExample);
      fail('Element should not exists');
    } catch (err) {
      expect(err.message).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });

  it('Should return headquarter warehouses', async () => {
    await createWarehouse('id1');
    await createWarehouse('id1');
    await createWarehouse('id1');
    await createWarehouse('id2');
    await createWarehouse('id3');
    await createWarehouse('id3');
    let list = await controller.readAllByHeadquarter('id1');
    expect(Array.isArray(list)).toBeTruthy();
    expect(list.length).toBe(3);
    list = await controller.readAllByHeadquarter('id3');
    expect(Array.isArray(list)).toBeTruthy();
    expect(list.length).toBe(2);
    list = await controller.readAllByHeadquarter('id4');
    expect(Array.isArray(list)).toBeTruthy();
    expect(list.length).toBe(0);
  });

  it('Should create one warehouse', async () => {
    const warehouse = new CreateWarehouseDto({
      headquarter: 'idCualquiera',
    });
    const created = await controller.create(warehouse);
    expect(created).toBeTruthy();
    expect(created.headquarter).toBe(warehouse.headquarter);
  });

  it('Should delete one element', async () => {
    const doc: Document = await createWarehouse('id1');
    let found = await mongo.findById(doc.id);
    expect(found).toBeTruthy();
    await controller.delete(doc.id);
    found = await mongo.findById(doc.id);
    expect(found).toBeFalsy();
  });

  it('Should add product', async () => {
    const doc: Document = await createWarehouse(uidExample);
    const response = await controller.addProduct(doc.id, {
      product: 'whatever',
      expiry: moment().format('YYYY-MM-DD'),
    });
    expect(Array.isArray(response.products)).toBeTruthy();
    expect(response.products.length).toBe(1);
  });

  it('Should fail when adding product', async () => {
    try {
      await controller.addProduct('not found', {
        product: 'whatever',
        expiry: moment().format('YYYY-MM-DD'),
      });
      fail('addProduct shoul fail');
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.status === 404);
    }
  });

  it('Should change stock when adding product', async () => {
    const doc: Document = await createWarehouse(uidExample);
    let result: WarehouseResponseDto;
    for (let i = 0; i < 10; i++) {
      result = await controller.addProduct(doc.id, {
        product: 'whatever',
        expiry: moment().format('YYYY-MM-DD'),
      });
      expect(result.metadata[0].stock).toBe(i + 1);
    }
    for (let i = result.metadata[0].stock - 1; i >= 0; i--) {
      result = await controller.retrieveProduct(doc.id, {
        product: 'whatever',
        idProduct: result.products[0].id,
      });
      if (result.metadata[0]) {
        expect(result.metadata[0].stock).toBe(i);
        expect(result.products.length).toBe(i);
        expect(result.products.length).toBeGreaterThan(0);
      } else expect(i).toBe(0);
    }
  });

  it('Should retrieve a product', async () => {
    const product = 'asdf';
    const doc: Document = await createWarehouse(uidExample);

    let response = await controller.addProduct(doc.id, {
      product,
      expiry: moment().format('YYYY-MM-DD'),
    });
    expect(Array.isArray(response.products)).toBeTruthy();
    expect(response.products.length).toBe(1);
    expect(response.metadata.length).toBe(1);
    expect(response.metadata[0].stock).toBe(1);
    const metadataId = response.metadata[0].id;

    response = await controller.addProduct(doc.id, {
      product,
      expiry: moment().format('YYYY-MM-DD'),
    });
    expect(Array.isArray(response.products)).toBeTruthy();
    expect(response.products.length).toBe(2);
    expect(response.metadata.length).toBe(1);
    expect(response.metadata[0].id).toBe(metadataId);
    expect(response.metadata[0].stock).toBe(2);
    const secondIdProduct = response.products[response.products.length - 1].id;

    response = await controller.addProduct(doc.id, {
      product,
      expiry: moment().format('YYYY-MM-DD'),
    });
    expect(Array.isArray(response.products)).toBeTruthy();
    expect(response.products.length).toBe(3);
    expect(response.metadata.length).toBe(1);
    expect(response.metadata[0].id).toBe(metadataId);
    expect(response.metadata[0].stock).toBe(3);

    response = await controller.retrieveProduct(doc.id, {
      product,
      idProduct: secondIdProduct,
    });
    expect(Array.isArray(response.products)).toBeTruthy();
    expect(response.metadata.length).toBe(1);
    expect(response.metadata[0].stock).toBe(2);
    expect(response.products.length).toBe(2);
    expect(response.products.find((p) => p.id === secondIdProduct)).toBeFalsy();
  });

  it('Should fail when retrieving product (warehouse)', async () => {
    try {
      await controller.retrieveProduct(uidExample, {
        product: 'whatever',
        idProduct: 'nope',
      });
      fail('retrieveProduct should fail');
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.message).toContain(uidExample);
      expect(err.status === 404);
    }
  });

  it('Should fail when retrieving product (metadata)', async () => {
    const product = 'asdf';
    try {
      const doc: Document = await createWarehouse(uidExample);
      const response = await controller.addProduct(doc.id, {
        product,
        expiry: moment().format('YYYY-MM-DD'),
      });
      expect(Array.isArray(response.products)).toBeTruthy();
      expect(response.products.length).toBe(1);
      await controller.retrieveProduct(doc.id, {
        product: 'nope',
        idProduct: 'whatever',
      });
      fail('retrieveProduct should fail');
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.message).toContain('warehouse.metadata');
      expect(err.status === 404);
    }
  });

  it('Should fail when retrieving product (product)', async () => {
    const product = 'asdf';
    try {
      const doc: Document = await createWarehouse(uidExample);
      const response = await controller.addProduct(doc.id, {
        product,
        expiry: moment().format('YYYY-MM-DD'),
      });
      expect(Array.isArray(response.products)).toBeTruthy();
      expect(response.products.length).toBe(1);
      await controller.retrieveProduct(doc.id, {
        product,
        idProduct: 'not found',
      });
      fail('retrieveProduct should fail');
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.message).toContain('warehouse.products');
      expect(err.status === 404);
    }
  });

  it('Should block product', async () => {
    const product = 'asdf';
    const doc: Document = await createWarehouse(uidExample);

    let response = await controller.addProduct(doc.id, {
      product,
      expiry: moment().format('YYYY-MM-DD'),
    });
    expect(Array.isArray(response.products)).toBeTruthy();
    expect(response.products.length).toBe(1);
    response = await controller.blockProduct(doc.id, { product });
    expect(response.metadata[0].blocked).toBeTruthy();
    response = await controller.readById(doc.id);
    expect(response.metadata[0].blocked).toBeTruthy();
  });

  it('Should unblock product', async () => {
    const product = 'asdf';
    const doc: Document = await createWarehouse(uidExample);

    let response = await controller.addProduct(doc.id, {
      product,
      expiry: moment().format('YYYY-MM-DD'),
    });
    expect(Array.isArray(response.products)).toBeTruthy();
    expect(response.products.length).toBe(1);
    response = await controller.blockProduct(doc.id, { product });
    expect(response.metadata[0].blocked).toBeTruthy();
    response = await controller.readById(doc.id);
    expect(response.metadata[0].blocked).toBeTruthy();

    response = await controller.unblockProduct(doc.id, { product });
    expect(response.metadata[0].blocked).toBeFalsy();
    response = await controller.readById(doc.id);
    expect(response.metadata[0].blocked).toBeFalsy();
  });

  it('Should not found when unblocking product', async () => {
    const product = 'asdf';
    const doc: Document = await createWarehouse(uidExample);

    const response = await controller.addProduct(doc.id, {
      product,
      expiry: moment().format('YYYY-MM-DD'),
    });
    expect(Array.isArray(response.products)).toBeTruthy();
    expect(response.products.length).toBe(1);
    try {
      await controller.blockProduct(doc.id, { product: 'nope' });
      fail('blockProduct should fail');
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });

  it('Should update product preference', async () => {
    const product = 'asdf';
    const preference = WarehouseProductPreference.HIGH;
    const doc: Document = await createWarehouse(uidExample);

    let response = await controller.addProduct(doc.id, {
      product,
      expiry: moment().format('YYYY-MM-DD'),
    });
    expect(Array.isArray(response.products)).toBeTruthy();
    expect(response.products.length).toBe(1);
    response = await controller.readById(doc.id);
    expect(response.metadata[0].preference).toBe(
      WarehouseProductPreference.MEDIUM,
    );
    response = await controller.updateProductPreference(doc.id, {
      product,
      preference,
    });
    expect(response.metadata[0].preference).toBe(preference);
    response = await controller.readById(doc.id);
    expect(response.metadata[0].preference).toBe(preference);
  });

  it('Should bad preference when updating product preference', async () => {
    const product = 'asdf';
    const doc: Document = await createWarehouse(uidExample);

    const response = await controller.addProduct(doc.id, {
      product,
      expiry: moment().format('YYYY-MM-DD'),
    });
    expect(Array.isArray(response.products)).toBeTruthy();
    expect(response.products.length).toBe(1);
    try {
      await controller.updateProductPreference(doc.id, {
        product,
        preference: 'cualquier cosa' as any,
      });
      fail('updateProductPreference should fail');
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.status).toBe(400);
      expect(err.message).toBe('Bad preference value');
    }
  });

  it('Should not found when updating product preference', async () => {
    const product = 'asdf';
    const preference = WarehouseProductPreference.HIGH;
    const doc: Document = await createWarehouse(uidExample);

    const response = await controller.addProduct(doc.id, {
      product,
      expiry: moment().format('YYYY-MM-DD'),
    });
    expect(Array.isArray(response.products)).toBeTruthy();
    expect(response.products.length).toBe(1);
    try {
      await controller.updateProductPreference(doc.id, {
        product: 'nope',
        preference,
      });
      fail('updateProductPreference should fail');
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });

  it('Should return one expired product', async () => {
    const doc: Document = await createWarehouse(uidExample);

    await controller.addProduct(doc.id, {
      product: 'producto1',
      expiry: moment().add(1, 'day').format('YYYY-MM-DD'),
    });
    await controller.addProduct(doc.id, {
      product: 'producto1',
      expiry: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    });
    await controller.addProduct(doc.id, {
      product: 'producto2',
      expiry: moment().add(1, 'day').format('YYYY-MM-DD'),
    });
    const response = await controller.readExpiredProductsById(doc.id);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBe(1);
  });

  it('Should return empty expired product', async () => {
    const doc: Document = await createWarehouse(uidExample);
    const response = await controller.readExpiredProductsById(doc.id);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBe(0);
  });

  it('Should return not found when reading expired product', async () => {
    await createWarehouse(uidExample);
    try {
      await controller.readExpiredProductsById(uidExample);
      fail('readExpiredProductsById should fail');
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });
});
