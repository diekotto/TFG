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
});
